import { global } from '@storybook/global';
import {
  CONFIG_ERROR,
  FORCE_REMOUNT,
  FORCE_RE_RENDER,
  GLOBALS_UPDATED,
  RESET_STORY_ARGS,
  SET_GLOBALS,
  STORY_ARGS_UPDATED,
  STORY_INDEX_INVALIDATED,
  UPDATE_GLOBALS,
  UPDATE_STORY_ARGS,
} from '@storybook/core-events';
import { logger } from '@storybook/client-logger';
import type { Channel } from '@storybook/channels';
import type {
  Renderer,
  Args,
  Globals,
  ModuleImportFn,
  RenderContextCallbacks,
  RenderToCanvas,
  PreparedStory,
  StoryIndex,
  ProjectAnnotations,
  StoryId,
  StoryRenderOptions,
  SetGlobalsPayload,
} from '@storybook/types';
import {
  CalledPreviewMethodBeforeInitializationError,
  MissingRenderToCanvasError,
  StoryIndexFetchError,
} from '@storybook/core-events/preview-errors';
import { addons } from '../addons';
import { StoryStore } from '../../store';

import { StoryRender } from './render/StoryRender';
import type { CsfDocsRender } from './render/CsfDocsRender';
import type { MdxDocsRender } from './render/MdxDocsRender';

const { fetch } = global;

const STORY_INDEX_PATH = './index.json';

export type MaybePromise<T> = Promise<T> | T;

export class Preview<TRenderer extends Renderer> {
  /**
   * @deprecated will be removed in 8.0, please use channel instead
   */
  serverChannel?: Channel;

  storyStore?: StoryStore<TRenderer>;

  renderToCanvas?: RenderToCanvas<TRenderer>;

  storyRenders: StoryRender<TRenderer>[] = [];

  previewEntryError?: Error;

  // While we wait for the index to load (note it may error for a while), we need to store the
  // project annotations. Once the index loads, it is stored on the store and this will get unset.
  private projectAnnotationsBeforeInitialization?: ProjectAnnotations<TRenderer>;

  protected storeInitializationPromise: Promise<void>;

  protected resolveStoreInitializationPromise!: () => void;

  constructor(
    public importFn: ModuleImportFn,

    public getProjectAnnotations: () => MaybePromise<ProjectAnnotations<TRenderer>>,

    protected channel: Channel = addons.getChannel()
  ) {
    if (addons.hasServerChannel()) {
      this.serverChannel = addons.getServerChannel();
    }

    this.storeInitializationPromise = new Promise((resolve) => {
      this.resolveStoreInitializationPromise = resolve;
    });
  }

  // INITIALIZATION
  async initialize() {
    this.setupListeners();

    const projectAnnotations = await this.getProjectAnnotationsOrRenderError();
    await this.initializeWithProjectAnnotations(projectAnnotations);
  }

  setupListeners() {
    this.channel.on(STORY_INDEX_INVALIDATED, this.onStoryIndexChanged.bind(this));
    this.channel.on(UPDATE_GLOBALS, this.onUpdateGlobals.bind(this));
    this.channel.on(UPDATE_STORY_ARGS, this.onUpdateArgs.bind(this));
    this.channel.on(RESET_STORY_ARGS, this.onResetArgs.bind(this));
    this.channel.on(FORCE_RE_RENDER, this.onForceReRender.bind(this));
    this.channel.on(FORCE_REMOUNT, this.onForceRemount.bind(this));
  }

  async getProjectAnnotationsOrRenderError(): Promise<ProjectAnnotations<TRenderer>> {
    try {
      const projectAnnotations = await this.getProjectAnnotations();

      this.renderToCanvas = projectAnnotations.renderToCanvas;
      if (!this.renderToCanvas) throw new MissingRenderToCanvasError({});

      return projectAnnotations;
    } catch (err) {
      // This is an error extracting the projectAnnotations (i.e. evaluating the previewEntries) and
      // needs to be show to the user as a simple error
      this.renderPreviewEntryError('Error reading preview.js:', err as Error);
      throw err;
    }
  }

  // If initialization gets as far as project annotations, this function runs.
  async initializeWithProjectAnnotations(projectAnnotations: ProjectAnnotations<TRenderer>) {
    this.projectAnnotationsBeforeInitialization = projectAnnotations;
    try {
      const storyIndex = await this.getStoryIndexFromServer();
      return this.initializeWithStoryIndex(storyIndex);
    } catch (err) {
      this.renderPreviewEntryError('Error loading story index:', err as Error);
      throw err;
    }
  }

  async getStoryIndexFromServer() {
    const result = await fetch(STORY_INDEX_PATH);
    if (result.status === 200) {
      return result.json() as any as StoryIndex;
    }

    throw new StoryIndexFetchError({ text: await result.text() });
  }

  // If initialization gets as far as the story index, this function runs.
  protected initializeWithStoryIndex(storyIndex: StoryIndex): void {
    if (!this.projectAnnotationsBeforeInitialization)
      // This is a protected method and so shouldn't be called out of order by users
      // eslint-disable-next-line local-rules/no-uncategorized-errors
      throw new Error('Cannot call initializeWithStoryIndex until project annotations resolve');

    this.storyStore = new StoryStore(
      storyIndex,
      this.importFn,
      this.projectAnnotationsBeforeInitialization
    );
    delete this.projectAnnotationsBeforeInitialization; // to avoid confusion

    this.setInitialGlobals();

    this.resolveStoreInitializationPromise();
  }

  async setInitialGlobals() {
    this.emitGlobals();
  }

  emitGlobals() {
    if (!this.storyStore)
      throw new CalledPreviewMethodBeforeInitializationError({ methodName: 'emitGlobals' });

    const payload: SetGlobalsPayload = {
      globals: this.storyStore.globals.get() || {},
      globalTypes: this.storyStore.projectAnnotations.globalTypes || {},
    };
    this.channel.emit(SET_GLOBALS, payload);
  }

  // EVENT HANDLERS

  // This happens when a config file gets reloaded
  async onGetProjectAnnotationsChanged({
    getProjectAnnotations,
  }: {
    getProjectAnnotations: () => MaybePromise<ProjectAnnotations<TRenderer>>;
  }) {
    delete this.previewEntryError;
    this.getProjectAnnotations = getProjectAnnotations;

    const projectAnnotations = await this.getProjectAnnotationsOrRenderError();
    if (!this.storyStore) {
      await this.initializeWithProjectAnnotations(projectAnnotations);
      return;
    }

    await this.storyStore.setProjectAnnotations(projectAnnotations);
    this.emitGlobals();
  }

  async onStoryIndexChanged() {
    delete this.previewEntryError;

    // We haven't successfully set project annotations yet,
    // we need to do that before we can do anything else.
    if (!this.storyStore && !this.projectAnnotationsBeforeInitialization) {
      return;
    }

    try {
      const storyIndex = await this.getStoryIndexFromServer();

      // We've been waiting for the index to resolve, now it has, so we can continue
      if (this.projectAnnotationsBeforeInitialization) {
        await this.initializeWithStoryIndex(storyIndex);
        return;
      }

      // Update the store with the new stories.
      await this.onStoriesChanged({ storyIndex });
    } catch (err) {
      this.renderPreviewEntryError('Error loading story index:', err as Error);
      throw err;
    }
  }

  // This happens when a glob gets HMR-ed
  async onStoriesChanged({
    importFn,
    storyIndex,
  }: {
    importFn?: ModuleImportFn;
    storyIndex?: StoryIndex;
  }) {
    if (!this.storyStore)
      throw new CalledPreviewMethodBeforeInitializationError({ methodName: 'onStoriesChanged' });
    await this.storyStore.onStoriesChanged({ importFn, storyIndex });
  }

  async onUpdateGlobals({ globals }: { globals: Globals }) {
    if (!this.storyStore)
      throw new CalledPreviewMethodBeforeInitializationError({ methodName: 'onUpdateGlobals' });
    this.storyStore.globals.update(globals);

    await Promise.all(this.storyRenders.map((r) => r.rerender()));

    this.channel.emit(GLOBALS_UPDATED, {
      globals: this.storyStore.globals.get(),
      initialGlobals: this.storyStore.globals.initialGlobals,
    });
  }

  async onUpdateArgs({ storyId, updatedArgs }: { storyId: StoryId; updatedArgs: Args }) {
    if (!this.storyStore)
      throw new CalledPreviewMethodBeforeInitializationError({ methodName: 'onUpdateArgs' });
    this.storyStore.args.update(storyId, updatedArgs);

    await Promise.all(
      this.storyRenders
        .filter((r) => r.id === storyId && !r.renderOptions.forceInitialArgs)
        .map((r) => r.rerender())
    );

    this.channel.emit(STORY_ARGS_UPDATED, {
      storyId,
      args: this.storyStore.args.get(storyId),
    });
  }

  async onResetArgs({ storyId, argNames }: { storyId: string; argNames?: string[] }) {
    if (!this.storyStore)
      throw new CalledPreviewMethodBeforeInitializationError({ methodName: 'onResetArgs' });

    // NOTE: we have to be careful here and avoid await-ing when updating a rendered's args.
    // That's because below in `renderStoryToElement` we have also bound to this event and will
    // render the story in the same tick.
    // However, we can do that safely as the current story is available in `this.storyRenders`
    const render = this.storyRenders.find((r) => r.id === storyId);
    const story = render?.story || (await this.storyStore.loadStory({ storyId }));

    const argNamesToReset = argNames || [
      ...new Set([
        ...Object.keys(story.initialArgs),
        ...Object.keys(this.storyStore.args.get(storyId)),
      ]),
    ];

    const updatedArgs = argNamesToReset.reduce((acc, argName) => {
      acc[argName] = story.initialArgs[argName];
      return acc;
    }, {} as Partial<Args>);

    await this.onUpdateArgs({ storyId, updatedArgs });
  }

  // ForceReRender does not include a story id, so we simply must
  // re-render all stories in case they are relevant
  async onForceReRender() {
    await Promise.all(this.storyRenders.map((r) => r.rerender()));
  }

  async onForceRemount({ storyId }: { storyId: StoryId }) {
    await Promise.all(this.storyRenders.filter((r) => r.id === storyId).map((r) => r.remount()));
  }

  // Used by docs to render a story to a given element
  // Note this short-circuits the `prepare()` phase of the StoryRender,
  // main to be consistent with the previous behaviour. In the future,
  // we will change it to go ahead and load the story, which will end up being
  // "instant", although async.
  renderStoryToElement(
    story: PreparedStory<TRenderer>,
    element: TRenderer['canvasElement'],
    callbacks: RenderContextCallbacks<TRenderer>,
    options: StoryRenderOptions
  ) {
    if (!this.renderToCanvas || !this.storyStore)
      throw new CalledPreviewMethodBeforeInitializationError({
        methodName: 'renderStoryToElement',
      });

    const render = new StoryRender<TRenderer>(
      this.channel,
      this.storyStore,
      this.renderToCanvas,
      callbacks,
      story.id,
      'docs',
      options,
      story
    );
    render.renderToElement(element);

    this.storyRenders.push(render);

    return async () => {
      await this.teardownRender(render);
    };
  }

  async teardownRender(
    render: StoryRender<TRenderer> | CsfDocsRender<TRenderer> | MdxDocsRender<TRenderer>,
    { viewModeChanged }: { viewModeChanged?: boolean } = {}
  ) {
    this.storyRenders = this.storyRenders.filter((r) => r !== render);
    await render?.teardown?.({ viewModeChanged });
  }

  // API
  async extract(options?: { includeDocsOnly: boolean }) {
    if (!this.storyStore)
      throw new CalledPreviewMethodBeforeInitializationError({ methodName: 'extract' });

    if (this.previewEntryError) throw this.previewEntryError;

    await this.storyStore.cacheAllCSFFiles();

    return this.storyStore.extract(options);
  }

  // UTILITIES

  renderPreviewEntryError(reason: string, err: Error) {
    this.previewEntryError = err;
    logger.error(reason);
    logger.error(err);
    this.channel.emit(CONFIG_ERROR, err);
  }
}

import type { Channel } from '@storybook/core/dist/channels';
import {
  STORY_RENDER_PHASE_CHANGED,
  STORY_RENDERED,
  PLAY_FUNCTION_THREW_EXCEPTION,
  UNHANDLED_ERRORS_WHILE_PLAYING,
} from '@storybook/core/dist/core-events';
import type { StoryStore } from '../../store';
import type { Render, RenderType } from './Render';
import { PREPARE_ABORTED } from './Render';
import type {
  Renderer,
  StoryContext,
  StoryContextForLoaders,
  StoryId,
  ViewMode,
} from '@storybook/core/dist/types';
import type {
  PreparedStory,
  RenderContext,
  RenderToCanvas,
  TeardownRenderToCanvas,
} from '@storybook/core/dist/types';
import type { RenderContextCallbacks, StoryRenderOptions } from '@storybook/core/dist/types';

const { AbortController } = globalThis;

export type RenderPhase =
  | 'preparing'
  | 'loading'
  | 'beforeEach'
  | 'rendering'
  | 'playing'
  | 'played'
  | 'completed'
  | 'aborted'
  | 'errored';

function serializeError(error: any) {
  try {
    const { name = 'Error', message = String(error), stack } = error;
    return { name, message, stack };
  } catch (e) {
    return { name: 'Error', message: String(error) };
  }
}

export class StoryRender<TRenderer extends Renderer> implements Render<TRenderer> {
  public type: RenderType = 'story';

  public story?: PreparedStory<TRenderer>;

  public phase?: RenderPhase;

  private abortController?: AbortController;

  private canvasElement?: TRenderer['canvasElement'];

  private notYetRendered = true;

  private rerenderEnqueued = false;

  public disableKeyListeners = false;

  private teardownRender: TeardownRenderToCanvas = () => {};

  public torndown = false;

  constructor(
    public channel: Channel,
    public store: StoryStore<TRenderer>,
    private renderToScreen: RenderToCanvas<TRenderer>,
    private callbacks: RenderContextCallbacks<TRenderer>,
    public id: StoryId,
    public viewMode: ViewMode,
    public renderOptions: StoryRenderOptions = { autoplay: true, forceInitialArgs: false },
    story?: PreparedStory<TRenderer>
  ) {
    this.abortController = new AbortController();

    // Allow short-circuiting preparing if we happen to already
    // have the story (this is used by docs mode)
    if (story) {
      this.story = story;
      // TODO -- what should the phase be now?
      // TODO -- should we emit the render phase changed event?
      this.phase = 'preparing';
    }
  }

  private async runPhase(signal: AbortSignal, phase: RenderPhase, phaseFn?: () => Promise<void>) {
    this.phase = phase;
    this.channel.emit(STORY_RENDER_PHASE_CHANGED, { newPhase: this.phase, storyId: this.id });
    if (phaseFn) await phaseFn();

    if (signal.aborted) {
      this.phase = 'aborted';
      this.channel.emit(STORY_RENDER_PHASE_CHANGED, { newPhase: this.phase, storyId: this.id });
    }
  }

  async prepare() {
    await this.runPhase((this.abortController as AbortController).signal, 'preparing', async () => {
      this.story = await this.store.loadStory({ storyId: this.id });
    });

    if ((this.abortController as AbortController).signal.aborted) {
      await this.store.cleanupStory(this.story as PreparedStory<TRenderer>);
      throw PREPARE_ABORTED;
    }
  }

  // The two story "renders" are equal and have both loaded the same story
  isEqual(other: Render<TRenderer>): boolean {
    return !!(
      this.id === other.id &&
      this.story &&
      this.story === (other as StoryRender<TRenderer>).story
    );
  }

  isPreparing() {
    return ['preparing'].includes(this.phase as RenderPhase);
  }

  isPending() {
    return ['loading', 'beforeEach', 'rendering', 'playing'].includes(this.phase as RenderPhase);
  }

  async renderToElement(canvasElement: TRenderer['canvasElement']) {
    this.canvasElement = canvasElement;

    // FIXME: this comment
    // Start the first (initial) render. We don't await here because we need to return the "cleanup"
    // function below right away, so if the user changes story during the first render we can cancel
    // it without having to first wait for it to finish.
    // Whenever the selection changes we want to force the component to be remounted.
    return this.render({ initial: true, forceRemount: true });
  }

  private storyContext() {
    if (!this.story) throw new Error(`Cannot call storyContext before preparing`);
    const { forceInitialArgs } = this.renderOptions;
    return this.store.getStoryContext(this.story, { forceInitialArgs });
  }

  async render({
    initial = false,
    forceRemount = false,
  }: {
    initial?: boolean;
    forceRemount?: boolean;
  } = {}) {
    const { canvasElement } = this;
    if (!this.story) throw new Error('cannot render when not prepared');
    const story = this.story;
    if (!canvasElement) throw new Error('cannot render when canvasElement is unset');

    const {
      id,
      componentId,
      title,
      name,
      tags,
      applyLoaders,
      applyBeforeEach,
      unboundStoryFn,
      playFunction,
    } = story;

    if (forceRemount && !initial) {
      // NOTE: we don't check the cancel actually worked here, so the previous
      // render could conceivably still be running after this call.
      // We might want to change that in the future.
      this.cancelRender();
      this.abortController = new AbortController();
    }

    // We need a stable reference to the signal -- if a re-mount happens the
    // abort controller may be torn down (above) before we actually check the signal.
    const abortSignal = (this.abortController as AbortController).signal;

    try {
      let loadedContext: Awaited<ReturnType<typeof applyLoaders>>;
      await this.runPhase(abortSignal, 'loading', async () => {
        loadedContext = await applyLoaders({
          ...this.storyContext(),
          viewMode: this.viewMode,
          // TODO add this to CSF
          canvasElement,
        } as unknown as StoryContextForLoaders<TRenderer>);
      });
      if (abortSignal.aborted) return;

      const renderStoryContext: StoryContext<TRenderer> = {
        ...loadedContext!,
        // By this stage, it is possible that new args/globals have been received for this story
        // and we need to ensure we render it with the new values
        ...this.storyContext(),
        abortSignal,
        // We should consider parameterizing the story types with TRenderer['canvasElement'] in the future
        canvasElement: canvasElement as any,
      };

      await this.runPhase(abortSignal, 'beforeEach', async () => {
        const cleanupCallbacks = await applyBeforeEach(renderStoryContext);
        this.store.addCleanupCallbacks(story, cleanupCallbacks);
      });

      if (abortSignal.aborted) return;

      const renderContext: RenderContext<TRenderer> = {
        componentId,
        title,
        kind: title,
        id,
        name,
        story: name,
        tags,
        ...this.callbacks,
        showError: (error) => {
          this.phase = 'errored';
          return this.callbacks.showError(error);
        },
        showException: (error) => {
          this.phase = 'errored';
          return this.callbacks.showException(error);
        },
        forceRemount: forceRemount || this.notYetRendered,
        storyContext: renderStoryContext,
        storyFn: () => unboundStoryFn(renderStoryContext),
        unboundStoryFn,
      };

      await this.runPhase(abortSignal, 'rendering', async () => {
        const teardown = await this.renderToScreen(renderContext, canvasElement);
        this.teardownRender = teardown || (() => {});
      });

      this.notYetRendered = false;
      if (abortSignal.aborted) return;

      const ignoreUnhandledErrors =
        this.story.parameters?.test?.dangerouslyIgnoreUnhandledErrors === true;

      const unhandledErrors: Set<unknown> = new Set();
      const onError = (event: ErrorEvent | PromiseRejectionEvent) =>
        unhandledErrors.add('error' in event ? event.error : event.reason);

      // The phase should be 'rendering' but it might be set to 'aborted' by another render cycle
      if (this.renderOptions.autoplay && forceRemount && playFunction && this.phase !== 'errored') {
        window.addEventListener('error', onError);
        window.addEventListener('unhandledrejection', onError);
        this.disableKeyListeners = true;
        try {
          await this.runPhase(abortSignal, 'playing', async () => {
            await playFunction(renderContext.storyContext);
          });
          if (!ignoreUnhandledErrors && unhandledErrors.size > 0) {
            await this.runPhase(abortSignal, 'errored');
          } else {
            await this.runPhase(abortSignal, 'played');
          }
        } catch (error) {
          await this.runPhase(abortSignal, 'errored', async () => {
            this.channel.emit(PLAY_FUNCTION_THREW_EXCEPTION, serializeError(error));
          });
          if (this.story.parameters.throwPlayFunctionExceptions !== false) throw error;
          console.error(error);
        }
        if (!ignoreUnhandledErrors && unhandledErrors.size > 0) {
          this.channel.emit(
            UNHANDLED_ERRORS_WHILE_PLAYING,
            Array.from(unhandledErrors).map(serializeError)
          );
        }
        this.disableKeyListeners = false;
        window.removeEventListener('unhandledrejection', onError);
        window.removeEventListener('error', onError);
        if (abortSignal.aborted) return;
      }

      await this.runPhase(abortSignal, 'completed', async () =>
        this.channel.emit(STORY_RENDERED, id)
      );
    } catch (err) {
      this.phase = 'errored';
      this.callbacks.showException(err as Error);
    }

    // If a rerender was enqueued during the render, clear the queue and render again
    if (this.rerenderEnqueued) {
      this.rerenderEnqueued = false;
      this.render();
    }
  }

  /**
   * Rerender the story.
   * If the story is currently pending (loading/rendering), the rerender will be enqueued,
   * and will be executed after the current render is completed.
   * Rerendering while playing will not be enqueued, and will be executed immediately, to support
   * rendering args changes while playing.
   */
  async rerender() {
    if (this.isPending() && this.phase !== 'playing') {
      this.rerenderEnqueued = true;
    } else {
      return this.render();
    }
  }

  async remount() {
    await this.teardown();
    return this.render({ forceRemount: true });
  }

  // If the story is torn down (either a new story is rendered or the docs page removes it)
  // we need to consider the fact that the initial render may not be finished
  // (possibly the loaders or the play function are still running). We use the controller
  // as a method to abort them, ASAP, but this is not foolproof as we cannot control what
  // happens inside the user's code.
  cancelRender() {
    this.abortController?.abort();
  }

  async teardown() {
    this.torndown = true;
    this.cancelRender();

    // If the story has loaded, we need to clean up
    if (this.story) {
      await this.store.cleanupStory(this.story);
    }

    // Check if we're done loading/rendering/playing. If not, we may have to reload the page.
    // Wait several ticks that may be needed to handle the abort, then try again.
    // Note that there's a max of 5 nested timeouts before they're no longer "instant".
    for (let i = 0; i < 3; i += 1) {
      if (!this.isPending()) {
        await this.teardownRender();
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    // If we still haven't completed, reload the page (iframe) to ensure we have a clean slate
    // for the next render. Since the reload can take a brief moment to happen, we want to stop
    // further rendering by awaiting a never-resolving promise (which is destroyed on reload).
    window.location.reload();
    await new Promise(() => {});
  }
}

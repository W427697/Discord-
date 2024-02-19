/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { isExportStory } from '@storybook/csf';
import type {
  Renderer,
  Args,
  ComponentAnnotations,
  LegacyStoryAnnotationsOrFn,
  ProjectAnnotations,
  ComposedStoryPlayFn,
  ComposeStoryFn,
  Store_CSFExports,
  StoryContext,
  Parameters,
  ComposedStoryFn,
  StrictArgTypes,
  ComposedStoryPlayContext,
} from '@storybook/types';

import { HooksContext } from '../../../addons';
import { composeConfigs } from './composeConfigs';
import { prepareContext, prepareStory } from './prepareStory';
import { normalizeStory } from './normalizeStory';
import { normalizeComponentAnnotations } from './normalizeComponentAnnotations';
import { getValuesFromArgTypes } from './getValuesFromArgTypes';
import { normalizeProjectAnnotations } from './normalizeProjectAnnotations';

let GLOBAL_STORYBOOK_PROJECT_ANNOTATIONS = composeConfigs([]);

export function setProjectAnnotations<TRenderer extends Renderer = Renderer>(
  projectAnnotations: ProjectAnnotations<TRenderer> | ProjectAnnotations<TRenderer>[]
) {
  const annotations = Array.isArray(projectAnnotations) ? projectAnnotations : [projectAnnotations];
  GLOBAL_STORYBOOK_PROJECT_ANNOTATIONS = composeConfigs(annotations);
}

export function composeStory<TRenderer extends Renderer = Renderer, TArgs extends Args = Args>(
  storyAnnotations: LegacyStoryAnnotationsOrFn<TRenderer>,
  componentAnnotations: ComponentAnnotations<TRenderer, TArgs>,
  projectAnnotations: ProjectAnnotations<TRenderer> = GLOBAL_STORYBOOK_PROJECT_ANNOTATIONS as ProjectAnnotations<TRenderer>,
  defaultConfig: ProjectAnnotations<TRenderer> = {},
  exportsName?: string
): ComposedStoryFn<TRenderer, Partial<TArgs>> {
  if (storyAnnotations === undefined) {
    throw new Error('Expected a story but received undefined.');
  }

  // @TODO: Support auto title

  componentAnnotations.title = componentAnnotations.title ?? 'ComposedStory';
  const normalizedComponentAnnotations =
    normalizeComponentAnnotations<TRenderer>(componentAnnotations);

  const storyName =
    exportsName ||
    storyAnnotations.storyName ||
    storyAnnotations.story?.name ||
    storyAnnotations.name ||
    'unknown';

  const normalizedStory = normalizeStory<TRenderer>(
    storyName,
    storyAnnotations,
    normalizedComponentAnnotations
  );

  const normalizedProjectAnnotations = normalizeProjectAnnotations<TRenderer>({
    ...projectAnnotations,
    ...defaultConfig,
  });

  const story = prepareStory<TRenderer>(
    normalizedStory,
    normalizedComponentAnnotations,
    normalizedProjectAnnotations
  );

  const defaultGlobals = getValuesFromArgTypes(projectAnnotations.globalTypes);

  const context: StoryContext<TRenderer> = {
    hooks: new HooksContext(),
    globals: defaultGlobals,
    args: { ...story.initialArgs },
    viewMode: 'story',
    loaded: {},
    abortSignal: null as unknown as AbortSignal,
    canvasElement: null,
    ...story,
  };

  const composedStory: ComposedStoryFn<TRenderer, Partial<TArgs>> = Object.assign(
    function storyFn(extraArgs?: Partial<TArgs>) {
      context.args = {
        ...context.initialArgs,
        ...extraArgs,
      };

      return story.unboundStoryFn(prepareContext(context));
    },
    {
      storyName,
      load: async () => {
        const loadedContext = await story.applyLoaders(context);
        context.loaded = loadedContext.loaded;
      },
      args: story.initialArgs as Partial<TArgs>,
      parameters: story.parameters as Parameters,
      argTypes: story.argTypes as StrictArgTypes<TArgs>,
      id: story.id,
      play: story.playFunction
        ? ((async (extraContext: ComposedStoryPlayContext<TRenderer, TArgs>) =>
            story.playFunction!({
              ...context,
              ...extraContext,
            })) as unknown as ComposedStoryPlayFn<TRenderer, Partial<TArgs>>)
        : undefined,
    }
  );

  return composedStory;
}

export function composeStories<TModule extends Store_CSFExports>(
  storiesImport: TModule,
  globalConfig: ProjectAnnotations<Renderer>,
  composeStoryFn: ComposeStoryFn
) {
  const { default: meta, __esModule, __namedExportsOrder, ...stories } = storiesImport;
  const composedStories = Object.entries(stories).reduce((storiesMap, [exportsName, story]) => {
    if (!isExportStory(exportsName, meta)) {
      return storiesMap;
    }

    const result = Object.assign(storiesMap, {
      [exportsName]: composeStoryFn(
        story as LegacyStoryAnnotationsOrFn,
        meta,
        globalConfig,
        exportsName
      ),
    });
    return result;
  }, {});

  return composedStories;
}

declare global {
  type WrappedStoryRef = { __pw_type: 'jsx' | 'importRef' };
  type UnwrappedJSXStoryRef = {
    __pw_type: 'jsx';
    type: ComposedStoryFn;
  };
  type UnwrappedImportStoryRef = ComposedStoryFn;

  function __pwUnwrapObject(
    storyRef: WrappedStoryRef
  ): UnwrappedJSXStoryRef | UnwrappedImportStoryRef;
}

const unwrapStory = async (storyRef: WrappedStoryRef) => {
  const unwrappedStoryRef = await globalThis.__pwUnwrapObject?.(storyRef);
  return '__pw_type' in unwrappedStoryRef ? unwrappedStoryRef.type : unwrappedStoryRef;
};

export function createPlaywrightTest<TFixture extends { extend: any }>(
  baseTest: TFixture
): TFixture {
  return baseTest.extend({
    mount: async ({ mount, page }: any, use: any) => {
      await use(async (storyRef: any) => {
        // load the story in the browser
        await page.evaluate(async (wrappedStoryRef: WrappedStoryRef) => {
          const story = await unwrapStory(wrappedStoryRef);
          return story?.load?.();
        }, storyRef);

        // mount the story
        const mountResult = await mount(storyRef);

        // play the story in the browser
        await page.evaluate(async (wrappedStoryRef: any) => {
          const story = await unwrapStory(wrappedStoryRef);
          const canvasElement = document.querySelector('#root');
          return story?.play?.({ canvasElement });
        }, storyRef);

        return mountResult;
      });
    },
  });
}

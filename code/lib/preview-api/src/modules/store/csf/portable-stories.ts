/* eslint-disable local-rules/no-uncategorized-errors */
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
  PlayFunctionContext,
} from '@storybook/types';

import { HooksContext } from '../../../addons';
import { composeConfigs } from './composeConfigs';
import { prepareContext, prepareStory } from './prepareStory';
import { normalizeStory } from './normalizeStory';
import { normalizeComponentAnnotations } from './normalizeComponentAnnotations';
import { getValuesFromArgTypes } from './getValuesFromArgTypes';
import { normalizeProjectAnnotations } from './normalizeProjectAnnotations';
import { normalizeArrays } from './normalizeArrays';

let GLOBAL_STORYBOOK_PROJECT_ANNOTATIONS = composeConfigs([]);

export function getPortableStoryWrapperId(storyId: string) {
  return `storybook-story-${storyId}`;
}

export function setProjectAnnotations<TRenderer extends Renderer = Renderer>(
  projectAnnotations: ProjectAnnotations<TRenderer> | ProjectAnnotations<TRenderer>[]
) {
  const annotations = Array.isArray(projectAnnotations) ? projectAnnotations : [projectAnnotations];
  GLOBAL_STORYBOOK_PROJECT_ANNOTATIONS = composeConfigs(annotations);
}

// TODO: this should be elsewhere, probably reused
function mergeAnnotations<TRenderer extends Renderer = Renderer>(
  firstAnnotations: ProjectAnnotations<TRenderer>,
  secondAnnotations: ProjectAnnotations<TRenderer>
) {
  return {
    ...firstAnnotations,
    ...secondAnnotations,
    args: {
      ...firstAnnotations.args,
      ...secondAnnotations.args,
    },
    argTypes: {
      ...firstAnnotations.argTypes,
      ...secondAnnotations.argTypes,
    },
    parameters: {
      ...firstAnnotations.parameters,
      ...secondAnnotations.parameters,
    },
    decorators: [
      ...normalizeArrays(firstAnnotations.decorators),
      ...normalizeArrays(secondAnnotations.decorators),
    ],
    loaders: [
      ...normalizeArrays(firstAnnotations.loaders),
      ...normalizeArrays(secondAnnotations.loaders),
    ],
    argsEnhancers: [
      ...normalizeArrays(firstAnnotations.argsEnhancers),
      ...normalizeArrays(secondAnnotations.argsEnhancers),
    ],
    argTypesEnhancers: [
      ...normalizeArrays(firstAnnotations.argTypesEnhancers),
      ...normalizeArrays(secondAnnotations.argTypesEnhancers),
    ],
  };
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

  // users might pass an empty object instead of undefined e.g. composeStory(story, meta, {}, exportsName)
  // and likely they expect the default project annotations to be used instead of completely resetting them
  if (typeof projectAnnotations === 'object' && Object.keys(projectAnnotations).length === 0) {
    projectAnnotations = GLOBAL_STORYBOOK_PROJECT_ANNOTATIONS as ProjectAnnotations<TRenderer>;
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
    'Unnamed Story';

  const normalizedStory = normalizeStory<TRenderer>(
    storyName,
    storyAnnotations,
    normalizedComponentAnnotations
  );

  const normalizedProjectAnnotations = normalizeProjectAnnotations<TRenderer>(
    mergeAnnotations(projectAnnotations, defaultConfig)
  );

  const story = prepareStory<TRenderer>(
    normalizedStory,
    normalizedComponentAnnotations,
    normalizedProjectAnnotations
  );

  const defaultGlobals = getValuesFromArgTypes(projectAnnotations.globalTypes);

  const context: StoryContext<TRenderer> = {
    hooks: new HooksContext(),
    globals: {
      ...defaultGlobals,
      ...projectAnnotations.globals,
    },
    args: { ...story.initialArgs },
    viewMode: 'story',
    loaded: {},
    abortSignal: null as unknown as AbortSignal,
    canvasElement: null,
    ...story,
  };

  const playFunction = story.playFunction
    ? async (extraContext: Partial<PlayFunctionContext<TRenderer, TArgs>>) =>
        story.playFunction!({
          ...context,
          ...extraContext,
          // if canvasElement is not provided, we default to the root element, which comes from a decorator
          // the decorator has to be implemented in the defaultAnnotations of each integrator of portable stories
          canvasElement:
            extraContext?.canvasElement ??
            globalThis.document?.getElementById(getPortableStoryWrapperId(context.id)),
        })
    : undefined;

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
      id: story.id,
      args: story.initialArgs as Partial<TArgs>,
      parameters: story.parameters as Parameters,
      argTypes: story.argTypes as StrictArgTypes<TArgs>,
      play: playFunction as ComposedStoryPlayFn<TRenderer, TArgs> | undefined,
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

type WrappedStoryRef = { __pw_type: 'jsx' | 'importRef' };
type UnwrappedJSXStoryRef = {
  __pw_type: 'jsx';
  type: ComposedStoryFn;
};
type UnwrappedImportStoryRef = ComposedStoryFn;

declare global {
  function __pwUnwrapObject(
    storyRef: WrappedStoryRef
  ): Promise<UnwrappedJSXStoryRef | UnwrappedImportStoryRef>;
}

export function createPlaywrightTest<TFixture extends { extend: any }>(
  baseTest: TFixture
): TFixture {
  return baseTest.extend({
    mount: async ({ mount, page }: any, use: any) => {
      await use(async (storyRef: WrappedStoryRef) => {
        // load the story in the browser
        await page.evaluate(async (wrappedStoryRef: WrappedStoryRef) => {
          const unwrappedStoryRef = await globalThis.__pwUnwrapObject?.(wrappedStoryRef);
          const story =
            '__pw_type' in unwrappedStoryRef ? unwrappedStoryRef.type : unwrappedStoryRef;
          return story?.load?.();
        }, storyRef);

        // mount the story
        const mountResult = await mount(storyRef);

        // play the story in the browser
        await page.evaluate(async (wrappedStoryRef: WrappedStoryRef) => {
          const unwrappedStoryRef = await globalThis.__pwUnwrapObject?.(wrappedStoryRef);
          const story =
            '__pw_type' in unwrappedStoryRef ? unwrappedStoryRef.type : unwrappedStoryRef;
          return story?.play?.();
        }, storyRef);

        return mountResult;
      });
    },
  });
}

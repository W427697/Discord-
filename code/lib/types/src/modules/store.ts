/* eslint-disable @typescript-eslint/naming-convention */
import type { SynchronousPromise } from 'synchronous-promise';
import type { Renderer, ProjectAnnotations as CsfProjectAnnotations } from '@storybook/csf';

import type {
  ComponentAnnotations,
  ComponentId,
  ComponentTitle,
  LegacyStoryFn,
  PartialStoryFn,
  Path,
  StoryAnnotations,
  StoryContext,
  StoryContextForEnhancers,
  StoryContextForLoaders,
  StoryFn,
  StoryId,
  StoryIdentifier,
  StoryName,
  StrictArgTypes,
  StrictGlobalTypes,
} from './csf';

// Internal to preview, exported until preview package consolidation
export type Store_PromiseLike<T> = Promise<T> | SynchronousPromise<T>;
export type Store_StorySpecifier = StoryId | { name: StoryName; title: ComponentTitle } | '*';

// Store Types
export interface WebRenderer extends Renderer {
  canvasElement: HTMLElement;
}

export type Store_ModuleExport = any;
export type Store_ModuleExports = Record<string, Store_ModuleExport>;
export type Store_ModuleImportFn = (path: Path) => Store_PromiseLike<Store_ModuleExports>;

type MaybePromise<T> = Promise<T> | T;
export type TeardownRenderToCanvas = () => MaybePromise<void>;
export type RenderToCanvas<TRenderer extends Renderer> = (
  context: Store_RenderContext<TRenderer>,
  element: TRenderer['canvasElement']
) => MaybePromise<void | TeardownRenderToCanvas>;

export type ProjectAnnotations<TRenderer extends Renderer> = CsfProjectAnnotations<TRenderer> & {
  renderToCanvas?: RenderToCanvas<TRenderer>;

  /* @deprecated use renderToCanvas */
  renderToDOM?: RenderToCanvas<TRenderer>;
};

export type Store_NormalizedProjectAnnotations<TRenderer extends Renderer = Renderer> =
  ProjectAnnotations<TRenderer> & {
    argTypes?: StrictArgTypes;
    globalTypes?: StrictGlobalTypes;
  };

export type Store_NormalizedComponentAnnotations<TRenderer extends Renderer = Renderer> =
  ComponentAnnotations<TRenderer> & {
    // Useful to guarantee that id & title exists
    id: ComponentId;
    title: ComponentTitle;
    argTypes?: StrictArgTypes;
  };

export type Store_NormalizedStoryAnnotations<TRenderer extends Renderer = Renderer> = Omit<
  StoryAnnotations<TRenderer>,
  'storyName' | 'story'
> & {
  moduleExport: Store_ModuleExport;
  // You cannot actually set id on story annotations, but we normalize it to be there for convience
  id: StoryId;
  argTypes?: StrictArgTypes;
  name: StoryName;
  userStoryFn?: StoryFn<TRenderer>;
};

export type Store_CSFFile<TRenderer extends Renderer = Renderer> = {
  meta: Store_NormalizedComponentAnnotations<TRenderer>;
  stories: Record<StoryId, Store_NormalizedStoryAnnotations<TRenderer>>;
};

export type Store_Story<TRenderer extends Renderer = Renderer> =
  StoryContextForEnhancers<TRenderer> & {
    moduleExport: Store_ModuleExport;
    originalStoryFn: StoryFn<TRenderer>;
    undecoratedStoryFn: LegacyStoryFn<TRenderer>;
    unboundStoryFn: LegacyStoryFn<TRenderer>;
    applyLoaders: (
      context: StoryContextForLoaders<TRenderer>
    ) => Promise<StoryContextForLoaders<TRenderer> & { loaded: StoryContext<TRenderer>['loaded'] }>;
    playFunction?: (context: StoryContext<TRenderer>) => Promise<void> | void;
  };

export type Store_BoundStory<TRenderer extends Renderer = Renderer> = Store_Story<TRenderer> & {
  storyFn: PartialStoryFn<TRenderer>;
};

export declare type Store_RenderContext<TRenderer extends Renderer = Renderer> = StoryIdentifier & {
  showMain: () => void;
  showError: (error: { title: string; description: string }) => void;
  showException: (err: Error) => void;
  forceRemount: boolean;
  storyContext: StoryContext<TRenderer>;
  storyFn: PartialStoryFn<TRenderer>;
  unboundStoryFn: LegacyStoryFn<TRenderer>;
};

export type Store_PropDescriptor = string[] | RegExp;

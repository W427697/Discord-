/* eslint-disable camelcase */
import type { SynchronousPromise } from 'synchronous-promise';
import type { Addon_IndexEntry, Addon_StoryIndexEntry } from './addons';
import type {
  AnyFramework,
  Args,
  ComponentAnnotations,
  ComponentId,
  ComponentTitle,
  DecoratorFunction,
  LegacyStoryFn,
  Parameters,
  PartialStoryFn,
  ProjectAnnotations,
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
  ViewMode,
} from './csf';

export type Store_Path = string;
export type Store_ModuleExport = any;
export type Store_ModuleExports = Record<string, Store_ModuleExport>;
export type Store_PromiseLike<T> = Promise<T> | SynchronousPromise<T>;
export type Store_ModuleImportFn = (path: Store_Path) => Store_PromiseLike<Store_ModuleExports>;

type Store_MaybePromise<T> = Promise<T> | T;

export type Store_TeardownRenderToDOM = () => Store_MaybePromise<void>;
export type Store_RenderToDOM<TFramework extends AnyFramework> = (
  context: Store_RenderContext<TFramework>,
  element: Element
) => Store_MaybePromise<void | Store_TeardownRenderToDOM>;

export type Store_WebProjectAnnotations<TFramework extends AnyFramework> =
  ProjectAnnotations<TFramework> & {
    renderToDOM?: Store_RenderToDOM<TFramework>;
  };

export type Store_NormalizedProjectAnnotations<TFramework extends AnyFramework = AnyFramework> =
  ProjectAnnotations<TFramework> & {
    argTypes?: StrictArgTypes;
    globalTypes?: StrictGlobalTypes;
  };

export type Store_NormalizedComponentAnnotations<TFramework extends AnyFramework = AnyFramework> =
  ComponentAnnotations<TFramework> & {
    // Useful to guarantee that id & title exists
    id: ComponentId;
    title: ComponentTitle;
    argTypes?: StrictArgTypes;
  };

export type Store_NormalizedStoryAnnotations<TFramework extends AnyFramework = AnyFramework> = Omit<
  StoryAnnotations<TFramework>,
  'storyName' | 'story'
> & {
  moduleExport: Store_ModuleExport;
  // You cannot actually set id on story annotations, but we normalize it to be there for convience
  id: StoryId;
  argTypes?: StrictArgTypes;
  name: StoryName;
  userStoryFn?: StoryFn<TFramework>;
};

export type Store_CSFFile<TFramework extends AnyFramework = AnyFramework> = {
  meta: Store_NormalizedComponentAnnotations<TFramework>;
  stories: Record<StoryId, Store_NormalizedStoryAnnotations<TFramework>>;
};

export type Store_Story<TFramework extends AnyFramework = AnyFramework> =
  StoryContextForEnhancers<TFramework> & {
    moduleExport: Store_ModuleExport;
    originalStoryFn: StoryFn<TFramework>;
    undecoratedStoryFn: LegacyStoryFn<TFramework>;
    unboundStoryFn: LegacyStoryFn<TFramework>;
    applyLoaders: (
      context: StoryContextForLoaders<TFramework>
    ) => Promise<
      StoryContextForLoaders<TFramework> & { loaded: StoryContext<TFramework>['loaded'] }
    >;
    playFunction?: (context: StoryContext<TFramework>) => Promise<void> | void;
  };

export type Store_BoundStory<TFramework extends AnyFramework = AnyFramework> =
  Store_Story<TFramework> & {
    storyFn: PartialStoryFn<TFramework>;
  };

export declare type Store_RenderContext<TFramework extends AnyFramework = AnyFramework> =
  StoryIdentifier & {
    showMain: () => void;
    showError: (error: { title: string; description: string }) => void;
    showException: (err: Error) => void;
    forceRemount: boolean;
    storyContext: StoryContext<TFramework>;
    storyFn: PartialStoryFn<TFramework>;
    unboundStoryFn: LegacyStoryFn<TFramework>;
  };

export interface Store_V2CompatIndexEntry extends Omit<Addon_StoryIndexEntry, 'type'> {
  kind: Addon_StoryIndexEntry['title'];
  story: Addon_StoryIndexEntry['name'];
  parameters: Parameters;
}

export interface Store_StoryIndexV3 {
  v: number;
  stories: Record<StoryId, Store_V2CompatIndexEntry>;
}

export interface Store_StoryIndex {
  v: number;
  entries: Record<StoryId, Addon_IndexEntry>;
}

export type Store_StorySpecifier = StoryId | { name: StoryName; title: ComponentTitle } | '*';

export interface Store_SelectionSpecifier {
  storySpecifier: Store_StorySpecifier;
  viewMode: ViewMode;
  args?: Args;
  globals?: Args;
}

export interface Store_Selection {
  storyId: StoryId;
  viewMode: ViewMode;
}

export type Store_DecoratorApplicator<TFramework extends AnyFramework = AnyFramework> = (
  storyFn: LegacyStoryFn<TFramework>,
  decorators: DecoratorFunction<TFramework>[]
) => LegacyStoryFn<TFramework>;

export interface Store_StoriesSpecifier {
  directory: string;
  titlePrefix?: string;
}
export interface Store_NormalizedStoriesSpecifier {
  glob?: string;
  specifier?: Store_StoriesSpecifier;
}

export type Store_ExtractOptions = {
  includeDocsOnly?: boolean;
};

export interface Store_NormalizedStoriesSpecifierEntry {
  titlePrefix?: string;
  directory: string;
  files?: string;
  importPathMatcher: RegExp;
}

export type Store_ContextStore<TFramework extends AnyFramework> = {
  value?: StoryContext<TFramework>;
};

export type Store_PropDescriptor = string[] | RegExp;

import {
  Addon,
  StoryId,
  StoryName,
  StoryKind,
  ViewMode,
  StoryIdentifier,
  StoryFn,
  Parameters,
  Args,
  ArgTypes,
  StoryApi,
  DecoratorFunction,
  DecorateStoryFunction,
  StoryContext,
} from '@storybook/addons';
import StoryStore from './story_store';
import { HooksContext } from './hooks';

export interface ErrorLike {
  message: string;
  stack: string;
}

// Metadata about a story that can be set at various levels: global, for a kind, or for a single story.
export interface StoryMetadata<StoryFnReturnType = unknown> {
  parameters: Parameters;
  decorators: DecoratorFunction<StoryFnReturnType>[];
}
export type ArgTypesEnhancer = (context: StoryContext) => ArgTypes;

type StorySpecifier = StoryId | { name: StoryName; kind: StoryKind } | '*';

export interface StoreSelectionSpecifier {
  storySpecifier: StorySpecifier;
  viewMode: ViewMode;
}

export interface StoreSelection {
  storyId: StoryId;
  viewMode: ViewMode;
}

export type AddStoryArgs<StoryFnReturnType = unknown> = StoryIdentifier & {
  storyFn: StoryFn<StoryFnReturnType>;
  parameters?: Parameters;
  decorators?: DecoratorFunction<StoryFnReturnType>[];
};

export type StoreItem<StoryFnReturnType = unknown> = StoryIdentifier & {
  parameters: Parameters;
  getDecorated: () => StoryFn<StoryFnReturnType>;
  getOriginal: () => StoryFn<StoryFnReturnType>;
  storyFn: StoryFn<StoryFnReturnType>;
  hooks: HooksContext;
  args: Args;
};

export type PublishedStoreItem = StoreItem & {
  globals: Args;
};

export interface StoreData<StoryFnReturnType = unknown> {
  [key: string]: StoreItem<StoryFnReturnType>;
}

export interface ClientApiParams<StoryFnReturnType = unknown> {
  storyStore: StoryStore;
  decorateStory?: DecorateStoryFunction<StoryFnReturnType>;
  noStoryModuleAddMethodHotDispose?: boolean;
}

export type ClientApiReturnFn<StoryFnReturnType> = (...args: any[]) => StoryApi<StoryFnReturnType>;

export { StoryApi, DecoratorFunction };

export interface ClientApiAddon<StoryFnReturnType = unknown> extends Addon {
  apply: (a: StoryApi<StoryFnReturnType>, b: any[]) => any;
}

export interface ClientApiAddons<StoryFnReturnType> {
  [key: string]: ClientApiAddon<StoryFnReturnType>;
}

export interface GetStorybookStory<StoryFnReturnType = unknown> {
  name: string;
  render: StoryFn<StoryFnReturnType>;
}

export interface GetStorybookKind {
  kind: string;
  fileName: string;
  stories: GetStorybookStory[];
}

// This really belongs in lib/core, but that depends on lib/ui which (dev) depends on app/react
// which needs this type. So we put it here to avoid the circular dependency problem.
export type RenderContext<StoryFnReturnType = unknown> = StoreItem<StoryFnReturnType> & {
  forceRender: boolean;

  showMain: () => void;
  showError: (error: { title: string; description: string }) => void;
  showException: (err: Error) => void;
};

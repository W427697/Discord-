/* eslint-disable camelcase */
import type { Addon_StoryApi, Addon_Type } from './addons';
import type { Store_RenderContext } from './store';
import type {
  AnyFramework,
  Args,
  ArgTypes,
  DecoratorFunction,
  LoaderFunction,
  Parameters,
  LegacyStoryFn,
  StoryContext,
  StoryFn,
  StoryId,
  StoryIdentifier,
  StoryKind,
  StoryName,
  ViewMode,
} from './csf';

export interface ClientAPI_ErrorLike {
  message: string;
  stack: string;
}

// Metadata about a story that can be set at various levels: global, for a kind, or for a single story.
export interface ClientAPI_StoryMetadata {
  parameters?: Parameters;
  decorators?: DecoratorFunction[];
  loaders?: LoaderFunction[];
}
export type ClientAPI_ArgTypesEnhancer = (context: StoryContext) => ArgTypes;
export type ClientAPI_ArgsEnhancer = (context: StoryContext) => Args;

type StorySpecifier = StoryId | { name: StoryName; kind: StoryKind } | '*';

export interface ClientAPI_StoreSelectionSpecifier {
  storySpecifier: StorySpecifier;
  viewMode: ViewMode;
  singleStory?: boolean;
  args?: Args;
  globals?: Args;
}

export interface ClientAPI_StoreSelection {
  storyId: StoryId;
  viewMode: ViewMode;
}

export type ClientAPI_AddStoryArgs = StoryIdentifier & {
  storyFn: StoryFn<any>;
  parameters?: Parameters;
  decorators?: DecoratorFunction[];
  loaders?: LoaderFunction[];
};

// export type ClientAPI_StoreItem = StoryIdentifier & {
//   parameters: Parameters;
//   getDecorated: () => StoryFn<any>;
//   getOriginal: () => StoryFn<any>;
//   applyLoaders: () => Promise<StoryContext>;
//   playFunction: (context: StoryContext) => Promise<void> | void;
//   storyFn: StoryFn<any>;
//   unboundStoryFn: StoryFn<any>;
//   hooks: HooksContext<AnyFramework>;
//   args: Args;
//   initialArgs: Args;
//   argTypes: ArgTypes;
// };

// export type ClientAPI_PublishedStoreItem = ClientAPI_StoreItem & {
//   globals: Args;
// };

// export interface ClientAPI_StoreData {
//   [key: string]: ClientAPI_StoreItem;
// }

// export interface ClientAPI_ClientApiParams {
//   storyStore: StoryStore<AnyFramework>;
//   decorateStory?: ProjectAnnotations<AnyFramework>['applyDecorators'];
//   noStoryModuleAddMethodHotDispose?: boolean;
// }

export type ClientAPI_ClientApiReturnFn<StoryFnReturnType> = (
  ...args: any[]
) => Addon_StoryApi<StoryFnReturnType>;

export interface ClientAPI_ClientApiAddon<StoryFnReturnType = unknown> extends Addon_Type {
  apply: (a: Addon_StoryApi<StoryFnReturnType>, b: any[]) => any;
}

export interface ClientAPI_ClientApiAddons<StoryFnReturnType> {
  [key: string]: ClientAPI_ClientApiAddon<StoryFnReturnType>;
}

export type ClientAPI_RenderContextWithoutStoryContext = Omit<Store_RenderContext, 'storyContext'>;

export interface ClientAPI_GetStorybookStory<TFramework extends AnyFramework> {
  name: string;
  render: LegacyStoryFn<TFramework>;
}

export interface ClientAPI_GetStorybookKind<TFramework extends AnyFramework> {
  kind: string;
  fileName: string;
  stories: ClientAPI_GetStorybookStory<TFramework>[];
}

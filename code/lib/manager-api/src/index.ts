/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./typings.d.ts" />

import { global } from '@storybook/global';
import type { Listener } from '@storybook/channels';
import type * as APIModule from '../../../ui/manager/src/api';

export const {
  ActiveTabs,
  Consumer,
  ManagerContext,
  Provider,
  addons,
  combineParameters,
  merge,
  mockChannel,
  types,
  useAddonState,
  useArgTypes,
  useArgs,
  useChannel,
  useGlobalTypes,
  useGlobals,
  useParameter,
  useSharedState,
  useStoryPrepared,
  useStorybookApi,
  useStorybookState,
  controlOrMetaKey,
  controlOrMetaSymbol,
  eventMatchesShortcut,
  eventToShortcut,
  isMacLike,
  isShortcutTaken,
  keyToSymbol,
  optionOrAltSymbol,
  shortcutMatchesShortcut,
  shortcutToHumanString,
} = global.__STORYBOOKAPI__ as typeof APIModule;

export type {
  API,
  API_EventMap,
  Addon,
  // ChannelListener,
  Combo,
  ComponentEntry,
  ComposedRef,
  AddonStore,
  DocsEntry,
  GroupEntry,
  HashEntry,
  IndexHash,
  KeyboardEventLike,
  LeafEntry,
  ManagerProviderProps,
  ModuleArgs,
  ModuleFn,
  Refs,
  RootEntry,
  State,
  StoreOptions,
  StoriesHash,
  StoryEntry,
} from '../../../ui/manager/src/api';

export type { Listener as ChannelListener };

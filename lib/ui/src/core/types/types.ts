import { Theme } from './themeTypes';

export interface LocalStorageShortcuts {
  [fullScreen: string]: string;
  togglePanel: string;
  panelPosition: string;
  toggleNav: string;
  toolbar: string;
  search: string;
  focusNav: string;
  focusIframe: string;
  focusPanel: string;
  prevComponent: string;
  nextComponent: string;
  prevStory: string;
  nextStory: string;
  shortcutsPage: string;
  aboutPage: string;
}

export interface SimpleKeybinding {
  altKey: boolean;
  ctrlKey: boolean;
  keyCode: number;
  metaKey: boolean;
  shiftKey: boolean;
  type: number;
}
export interface UIShortcuts {
  [fullScreen: string]: SimpleKeybinding;
  togglePanel: SimpleKeybinding;
  panelPosition: SimpleKeybinding;
  toggleNav: SimpleKeybinding;
  toolbar: SimpleKeybinding;
  search: SimpleKeybinding;
  focusNav: SimpleKeybinding;
  focusIframe: SimpleKeybinding;
  focusPanel: SimpleKeybinding;
  prevComponent: SimpleKeybinding;
  nextComponent: SimpleKeybinding;
  prevStory: SimpleKeybinding;
  nextStory: SimpleKeybinding;
  shortcutsPage: SimpleKeybinding;
  aboutPage: SimpleKeybinding;
}
export interface Version {
  version: string;
  info?: {
    plain: string;
  };
}
export interface Versions {
  current: Version;
  latest: Version;
}

export interface RetrievedStoreState {
  customQueryParams: {};
  dismissedVersionNotification?: any;
  lastVersionCheck: number;
  layout: Layout;
  location: Location;
  notifications: Notification[];
  path: string;
  selectedPanel?: any;
  shortcuts: LocalStorageShortcuts;
  storiesHash: {};
  storyId?: any;
  ui: UI;
  versions: Versions;
}

export interface Layout {
  isFullscreen: boolean;
  isToolshown: boolean;
  panelPosition: string;
  showNav: boolean;
  showPanel: boolean;
}

export interface Location {
  ancestorOrigins: DOMStringList;
  assign: () => void;
  hash: string;
  host: string;
  hostname: string;
  href: string;
  key: string;
  origin: string;
  pathname: string;
  port: string;
  protocol: string;
  reload: () => void;
  replace: () => void;
  search: string;
  state: {
    key: string;
  };
  toString: () => string;
}

export interface Notification {
  content: string;
  icon: string;
  id: string;
  level: number;
  link: string;
  onClear: () => void;
}

export interface UI {
  enableShortcuts: boolean;
  name: string;
  sidebarAnimations: boolean;
  sortStoriesByKind: boolean;
  theme: Theme;
  url: string;
}

export interface Store {
  store: {
    getState: () => RetrievedStoreState;
    setState: (...args: any[]) => void;
  };
}

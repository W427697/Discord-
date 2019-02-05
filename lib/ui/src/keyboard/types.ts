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

import { ReactElement } from 'react';
// tslint:disable-next-line:no-implicit-dependencies
import { Channel } from '@storybook/channels';
import { Version, LocalStorageShortcuts, UIShortcuts } from './types';

interface TextParameter {
  text: string;
}

interface MarkdownParameter {
  markdown: string;
}

interface DisabledParameter {
  disable: boolean;
}
// type Panel =
export type Parameters = string | TextParameter | MarkdownParameter | DisabledParameter;
export interface Api {
  // getData:() => getData(storyId)
  getCurrentVersion: () => Version;
  getQueryParam: (key: any) => void;
  getShortcutKeys: () => LocalStorageShortcuts;
  getUrlState: () => {
    queryParams: any;
    path: string;
    viewMode: string;
    storyId: string;
    url: string;
  };
  handleKeydownEvent: (fullApi: any, event: KeyboardEvent) => void;
  handleShortcutFeature: (fullApi: any, feature: string) => any;

  jumpToComponent: (direction: number) => void;
  jumpToStory: (direction: number) => void;
  getLatestVersion: () => Version;
  navigate: (to: string) => void;
  getPanels: () => any;
  onStory: () => any;
  restoreAllDefaultShortcuts: () => void;
  restoreDefaultShortcut: (shortcut: string) => void;
  selectStory: (kindOrId: string, story: string) => void;
  setOptions: (options: any) => void;
  setQueryParams: () => void;
  setSelectedPanel: (panelName: string) => void;
  setShortcut: (action: string, value: string) => Promise<UIShortcuts>;
  setShortcuts: (shortcuts: LocalStorageShortcuts) => Promise<UIShortcuts>;
  setStories: (input: any) => void;
  // storyId:() => toId(kind, story)
  toggleFullscreen: () => void;
  toggleNav: () => void;
  togglePanel: () => void;
  togglePanelPosition: () => void;
  toggleToolbar: () => void;
  versionUpdateAvailable: () => boolean;
  addNotification: ({ id, ...args }: { id: string; args: any }) => any;
  clearNotification: (arg0: string) => void;
  getChannel: () => Channel;
  getCurrentStoryData: () => any;
  getParameters(id: string, scope?: string): undefined | Parameters;
  getElements(
    type: string
  ): {
    [id: string]: {
      id: string;
      render: () => ReactElement<any>;
    };
  };
  getSelectedPanel(callback: () => any): any;
  off(event: string, callback: (...args: any) => any): void;
  on(event: string, callback: (...args: any) => any): void;

  emit(event: string, callback: (...args: any) => any): void;
}

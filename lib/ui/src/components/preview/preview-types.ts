import { types } from '@storybook/addons';
import { API } from '@storybook/api';

export type Noop = () => void;

export type ViewMode = 'story' | 'info' | 'docs' | 'settings';

export type PreviewStory = {
  id: string;
  source: string;
  knownAs: string;
};

export type CustomCanvas = (
  viewMode: ViewMode,
  currentUrl: string,
  scale: number,
  queryParams: Record<string, any>,
  frames: Record<string, string>,
  storyId?: string
) => JSX.Element;

export type PreviewElement = {
  id: string;
  type: types;
  title: string;
  route: ({ storyId: string }) => string;
  match: ({ viewMode: ViewMode }) => boolean;
  render: Noop;
};

export interface PreviewPropsBase {
  customCanvas?: CustomCanvas;
  frames?: Record<string, string>;
  queryParams: Record<string, any>;
  storyId?: string;
  story?: PreviewStory;
  docsOnly?: boolean;
  viewMode?: ViewMode;
}
export interface PreviewProps extends PreviewPropsBase {
  description?: string;
  api: API;
  story?: PreviewStory;
  path: string;
  location: Location;
  getElements: (type: any) => PreviewElement[];
  options: {
    isFullscreen: boolean;
    isToolshown: boolean;
  };
}
export interface Wrapper {
  render: (child: {
    index: number;
    children: React.ReactNode;
    storyId?: string;
    active: boolean;
  }) => JSX.Element;
}
export interface ListItem {
  id: string;
  key: string | number;
  render: () => React.ReactNode;
}

export interface ActualPreviewProps extends PreviewPropsBase {
  wrappers: Wrapper[];
  active: boolean;
  scale: number;
  frames: Record<string, string>;
  currentUrl: string;
}

export interface RouteParameter {
  storyId?: string;
  viewMode: ViewMode;
  location: Location;
  path: string;
}

export interface Panel {
  match: (p: RouteParameter) => boolean;
  route: (p: RouteParameter) => string;
  id: string;
  title: string;
  viewMode: ViewMode;
}

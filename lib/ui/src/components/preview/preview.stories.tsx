import React from 'react';

import { types } from '@storybook/addons';
import { Preview, ViewMode } from './preview';

export default {
  component: Preview,
  title: 'UI/Preview/Preview',
};

export const noTabs = () => <Preview {...previewProps} getElements={() => []} />;
export const withTabs = () => <Preview {...previewProps} />;

const getElements = (type: types) => {
  if (type === types.TAB) {
    return [
      {
        id: 'notes',
        type: types.TAB,
        title: 'Notes',
        route: ({ storyId }: { storyId: string }) => `/info/${storyId}`,
        match: ({ viewMode }: { viewMode: ViewMode }) => viewMode === 'info',
        render: () => null,
      },
    ];
  }
  return [];
};

const previewProps = {
  id: 'string',
  api: {
    on: () => {},
    emit: () => {},
    off: () => {},
    toggleFullScreen: () => {},
  },
  storyId: 'string',
  path: 'string',
  viewMode: 'story' as ViewMode,
  location: {},
  baseUrl: 'http://example.com',
  queryParams: {},
  options: {
    isFullscreen: false,
    isToolshown: true,
  },
  actions: {},
  getElements,
};

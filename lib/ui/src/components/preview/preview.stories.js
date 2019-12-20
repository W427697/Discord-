import React from 'react';

import { types } from '@storybook/addons';
import { Preview } from './preview';

export default {
  component: Preview,
  title: 'UI/Preview/Preview',
};

export const noTabs = () => <Preview {...previewProps} getElements={() => []} />;
export const withTabs = () => <Preview {...previewProps} />;

const getElements = type => {
  if (type === types.TAB) {
    return [
      {
        id: 'notes',
        type: types.TAB,
        title: 'Notes',
        route: ({ storyId }) => `/info/${storyId}`,
        match: ({ viewMode }) => viewMode === 'info',
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
  viewMode: 'story',
  location: {
    ancestorOrigins: [],
    hash: '',
    host: '',
    hostname: '',
    href: '',
    origin: '',
    pathname: '',
    port: '',
    protocol: '',
    search: '',
    assign() {},
    reload() {},
    replace() {},
  },
  baseUrl: 'http://example.com',
  queryParams: {},
  options: {
    isFullscreen: false,
    isToolshown: true,
  },
  actions: {},
  getElements,
};

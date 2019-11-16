import React from 'react';
import { storiesOf } from '@storybook/react';
import { types } from '@storybook/addons';

import { Preview, ViewMode } from './preview';

const getPreviewElements = (type: types) => {
  if (type === types.TAB) {
    return [
      {
        id: 'notes',
        type: types.TAB,
        title: 'Notes',
        route: ({ storyId }: { storyId: string }) => `/info/${storyId}`, // todo add type
        match: ({ viewMode }: { viewMode: ViewM }) => viewMode === 'info', // todo add type
        render: () => null,
      },
    ];
  }
  return [];
};

export const previewProps = {
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
  getPreviewElements,
};

storiesOf('UI/Preview/Preview', module)
  .addParameters({
    component: Preview,
  })
  .add('no tabs', () => <Preview {...previewProps} getPreviewElements={() => []} />)
  .add('with tabs', () => <Preview {...previewProps} />);

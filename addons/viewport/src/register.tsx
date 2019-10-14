import * as React from 'react';
import addons, { types } from '@storybook/addons';

import { ADDON_ID } from './constants';

import { ViewportTool } from './components/Tool';

addons.register(ADDON_ID, api => {
  addons.add(ADDON_ID, {
    title: 'viewport / media-queries',
    type: types.TOOL,
    match: ({ viewMode }) => viewMode === 'story',
    render: () => <ViewportTool api={api} />,
  });
});

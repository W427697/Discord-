import React from 'react';
import { addons, types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';

import { API } from '@storybook/api';
import Editor from './Editor';

// @ts-ignore
addons.register('editor', (api: API) => {
  addons.add('editor', {
    type: types.PANEL,
    title: 'editor',
    paramKey: 'storysource',
    render: ({ active, key }) => {
      return (
        <AddonPanel active={active} key={key}>
          <Editor api={api} />
        </AddonPanel>
      );
    },
  });
});

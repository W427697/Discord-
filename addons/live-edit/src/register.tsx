import React from 'react';
import { addons, types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';

import Editor from './Editor';

addons.register('editor', api => {
  addons.add('editor', {
    type: types.PANEL,
    title: 'editor',
    paramKey: 'storysource',
    render: ({ active, key}) => {
      return (
        <AddonPanel active={active} key={key}>
          <Editor api={api} />
        </AddonPanel>
      );
    },
  });
});

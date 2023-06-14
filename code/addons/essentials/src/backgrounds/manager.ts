import { addons, types } from '@storybook/manager-api';
import React from 'react';

export * from '@storybook/addon-backgrounds/manager';

addons.register('@storybook/addon-debugger', (api) => {
  addons.addPanel('@storybook/addon-debugger/panel', {
    title: '/debugger/',
    type: types.MAIN,
    render: () => {
      console.log('debugger');
      return React.createElement('div', null, 'debugger');
    },
  });
});

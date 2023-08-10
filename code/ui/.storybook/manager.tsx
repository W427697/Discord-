import React from 'react';
import { addons, types } from '@storybook/manager-api';
import startCase from 'lodash/startCase.js';

addons.setConfig({
  sidebar: {
    renderLabel: ({ name, type }) => (type === 'story' ? name : startCase(name)),
    // filters: {
    //   a: (item) => item.depth === 2,
    // },
  },
});

// addons.register('my/design-addon', () => {
//   addons.add('my/design-addon', {
//     type: types.experimental_SIDEBAR_BOTTOM,
//     id: 'my/design-addon/panel',
//     render: () => <div>HI</div>,
//   });
// });

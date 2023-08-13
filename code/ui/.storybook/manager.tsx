import { addons, types, type API } from '@storybook/manager-api';
import { IconButton, Icons } from '@storybook/components';
import startCase from 'lodash/startCase.js';
import React, { Fragment } from 'react';
import { NativeTextArea } from './NativeTextArea';

addons.setConfig({
  sidebar: {
    renderLabel: ({ name, type }) => (type === 'story' ? name : startCase(name)),
  },
});

addons.register('my-addon', (api: API) => {
  addons.addControl('nativetextarea', {
    title: 'My Control',
    type: types.CONTROL,
    paramKey: 'my-control',
    render: NativeTextArea,
  });
});

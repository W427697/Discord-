import React from 'react';
import addons from '@storybook/addons';
import JSX from './containers';
import { ADDON_ID, PANEL_ID } from './consts';

addons.register(ADDON_ID, () => {
  addons.addPanel(PANEL_ID, {
    title: 'JSX',
    render: ({ key }) => <JSX key={key} />,
  });
});

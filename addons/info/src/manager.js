import React from 'react';
import addons from '@storybook/addons';
import InfoPanel from './panel';
import { ADDON_ID, PANEL_ID, ADDON_TITLE } from './config';

export function register() {
  addons.register(ADDON_ID, () => {
    const channel = addons.getChannel();
    addons.addPanel(PANEL_ID, {
      title: ADDON_TITLE,
      render: () => <InfoPanel channel={channel} />,
    });
  });
}

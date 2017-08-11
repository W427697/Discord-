import React from 'react';
import addons from '@storybook/addons';
import QRCodePanel from './containers/QRCodePanel';
import { ADDON_ID, PANEL_ID } from './';

export function register() {
  addons.register(ADDON_ID, () => {
    const channel = addons.getChannel();
    addons.addPanel(PANEL_ID, {
      title: 'RN Pair',
      render: () => <QRCodePanel channel={channel} />,
    });
  });
}

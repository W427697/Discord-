import React from 'react';
import addons from '@storybook/addons';
import { compose } from 'react-komposer';
import InfoPanel from './panel';
import { ADDON_ID, PANEL_ID, ADDON_TITLE, EVENT_ID } from './config';

function infoHandler({ api }, onData) {
  const channel = addons.getChannel();
  channel.on(EVENT_ID, ({ infoString }) => onData(null, { infoString }));
  api.onStory(() => onData(null, {}));
  onData(null, {});
}
const InfoContainer = compose(infoHandler)(InfoPanel);

export function register() {
  addons.register(ADDON_ID, api => {
    addons.addPanel(PANEL_ID, {
      title: ADDON_TITLE,
      render: () => <InfoContainer api={api} />,
    });
  });
}

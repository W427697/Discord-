import React from 'react';
import addons from '@storybook/addons';
import { compose } from 'react-komposer';
import InfoPanel from './panel';
import { ADDON_ID, PANEL_ID, ADDON_TITLE, EVENT_ID } from './config';

function createEventsListener(api, channel) {
  let onData = () => {};

  channel.on(EVENT_ID, ({ infoString }) => onData(null, { infoString }));
  api.onStory(() => onData(null, {}));

  return onDataFn => {
    onData = onDataFn;
    return () => {
      onData = () => {};
    };
  };
}

function infoHandler({ listener }, onData) {
  const stopSubscription = listener(onData);
  return stopSubscription;
}
const InfoContainer = compose(infoHandler)(InfoPanel);

export function register() {
  addons.register(ADDON_ID, api => {
    const eventsListener = createEventsListener(api, addons.getChannel());
    addons.addPanel(PANEL_ID, {
      title: ADDON_TITLE,
      render: () => <InfoContainer listener={eventsListener} />,
    });
  });
}

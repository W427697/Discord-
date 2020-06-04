import React from 'react';
import addons, { types } from '@storybook/addons';
import { ID, STORY_SELECTED_EVENT } from './constants';

const Panel = () => <>Startup tests</>;

addons.register(ID, (api) => {
  addons.add(ID, {
    title: ID,
    type: types.PANEL,
    match: () => true,
    render: ({ key, active }) => (active ? <Panel key={key} /> : null),
  });

  const channel = addons.getChannel();
  channel.on(STORY_SELECTED_EVENT, (data) => {
    console.log(`Received: ${STORY_SELECTED_EVENT}: ${data}`);
  });
});

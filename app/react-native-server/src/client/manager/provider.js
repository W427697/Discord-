import React from 'react';
import uuid from 'uuid';

import { Consumer } from '@storybook/api';
import { Provider } from '@storybook/ui';
import createChannel from '@storybook/channel-websocket';
import { addons } from '@storybook/addons';
import {
  CHANNEL_CREATED,
  GET_CURRENT_STORY,
  SET_CURRENT_STORY,
  GET_STORIES,
  STORY_CHANGED,
} from '@storybook/core-events';

import PreviewHelp from './components/PreviewHelp';

const mapper = ({ state, api }) => ({
  api,
  storiesHash: state.storiesHash,
  storyId: state.storyId,
});

export default class ReactProvider extends Provider {
  constructor({ url: domain, options }) {
    super();

    const { secured, host, port } = options;
    const websocketType = secured ? 'wss' : 'ws';
    let url = `${websocketType}://${domain}`;

    if (options.manualId) {
      this.pairedId = uuid();
      url += `/pairedId=${this.pairedId}`;
    }

    const channel = this.channel || createChannel({ url });

    addons.setChannel(channel);
    channel.emit(CHANNEL_CREATED, {
      host,
      pairedId: this.pairedId,
      port,
      secured,
    });

    this.addons = addons;
    this.channel = channel;
    this.options = options;
  }

  getElements(type) {
    return addons.getElements(type);
  }

  renderPreview() {
    return (
      <Consumer filter={mapper} pure>
        {({ storiesHash, storyId, api }) => {
          if (storiesHash[storyId]) {
            const { kind, story } = storiesHash[storyId];
            api.emit(SET_CURRENT_STORY, { kind, story });
          }
          return <PreviewHelp />;
        }}
      </Consumer>
    );
  }

  handleAPI(api) {
    addons.loadAddons(api);
    api.on(STORY_CHANGED, () => {
      api.emit(SET_CURRENT_STORY, this.selection);
    });
    api.on(GET_CURRENT_STORY, () => {
      api.emit(SET_CURRENT_STORY, this.selection);
    });
    api.emit(GET_STORIES);
  }
}

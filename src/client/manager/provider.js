import UUID from 'uuid';
import qs from 'qs';
import React from 'react';
import { Provider } from '@kadira/storybook-ui';
import addons from '@kadira/storybook-addons';
import Channel from '@kadira/storybook-channel';
import PageBusTransport from '@kadira/storybook-channel-pagebus';
import Preview from './preview';

export default class ReactProvider extends Provider {
  constructor() {
    super();
    this.pageBusKey = UUID.v4();
    const transport = new PageBusTransport({ key: this.pageBusKey });
    this.channel = new Channel({ transport });
    addons.setChannel(this.channel);
  }

  getPanels() {
    return addons.getPanels();
  }

  renderPreview(selectedKind, selectedStory) {
    const queryParams = {
      dataId: this.pageBusKey,
      selectedKind,
      selectedStory,
    };

    const queryString = qs.stringify(queryParams);
    const url = `iframe.html?${queryString}`;
    return (
      <Preview url={url} />
    );
  }

  handleAPI(api) {
    api.onStory((kind, story) => {
      this.channel.emit('setCurrentStory', { kind, story });
    });
    this.channel.on('setStories', data => {
      api.setStories(data.stories);
    });
    this.channel.on('selectStory', data => {
      api.selectStory(data.kind, data.story);
    });
    this.channel.on('applyShortcut', data => {
      api.handleShortcut(data.event);
    });
    addons.loadAddons(api);
  }
}

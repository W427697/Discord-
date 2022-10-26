/* eslint-disable camelcase */
import global from 'global';
import { Provider } from '@storybook/ui';
import { Channel } from '@storybook/channels';
import { addons, AddonStore, type Types } from '@storybook/addons';
import type { Addon_Config } from '@storybook/types';
import * as postMessage from '@storybook/channel-postmessage';
import * as webSocket from '@storybook/channel-websocket';
import { CHANNEL_CREATED } from '@storybook/core-events';

const { FEATURES, SERVER_CHANNEL_URL } = global;

export default class ReactProvider extends Provider {
  private addons: AddonStore;

  private channel: Channel;

  private serverChannel?: Channel;

  constructor() {
    super();

    const channel = postMessage.createChannel({ page: 'manager' });

    addons.setChannel(channel);
    channel.emit(CHANNEL_CREATED);

    this.addons = addons;
    this.channel = channel;

    if (FEATURES?.storyStoreV7 && SERVER_CHANNEL_URL) {
      const serverChannel = webSocket.createChannel({ url: SERVER_CHANNEL_URL });
      this.serverChannel = serverChannel;
      addons.setServerChannel(this.serverChannel);
    }
  }

  getElements(type: Types) {
    return this.addons.getElements(type);
  }

  getConfig(): Addon_Config {
    return this.addons.getConfig();
  }

  handleAPI(api: unknown) {
    this.addons.loadAddons(api);
  }
}

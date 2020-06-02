import addons, { Types, Channel, AddonStore } from '@storybook/addons';
import createChannel from '@storybook/channel-postmessage';
import Events from '@storybook/core-events';

import Provider from './BaseProvider';

export default class ReactProvider extends Provider {
  constructor() {
    super();

    const channel = createChannel({ page: 'manager' });

    addons.setChannel(channel);
    channel.emit(Events.CHANNEL_CREATED);

    this.addons = addons;
    this.channel = channel;
  }

  addons: AddonStore;

  channel: Channel;

  getElements(type: Types) {
    return this.addons.getElements(type);
  }

  getConfig() {
    return this.addons.getConfig();
  }

  handleAPI(api: any) {
    this.addons.loadAddons(api);
  }
}

import { Provider } from '@storybook/ui';
import addons, { AddonStore } from '@storybook/addons';
import createChannel from '@storybook/channel-postmessage';
import Events from '@storybook/core-events';
import Channel from '@storybook/channels';

export default class ReactProvider extends Provider {
  addons: AddonStore;

  channel: Channel;

  constructor() {
    super();

    const channel = createChannel({ page: 'manager' });

    addons.setChannel(channel);
    channel.emit(Events.CHANNEL_CREATED);

    this.addons = addons;
    this.channel = channel;
  }

  getElements(type: string) {
    return this.addons.getElements(type);
  }

  getConfig() {
    return this.addons.getConfig();
  }

  handleAPI(api: any) {
    this.addons.loadAddons(api);
  }
}

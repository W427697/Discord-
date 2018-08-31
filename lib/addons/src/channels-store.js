import global from 'global';

class ChannelsStore {
  constructor() {
    this.channel = null;
  }

  getChannel() {
    // this.channel should get overwritten by setChannel. If it wasn't called (e.g. in non-browser environment), throw.
    if (!this.channel) {
      throw new Error(
        'Accessing nonexistent addons channel, see https://storybook.js.org/basics/faq/#why-is-there-no-addons-channel'
      );
    }
    return this.channel;
  }

  hasChannel() {
    return Boolean(this.channel);
  }

  setChannel(channel) {
    this.channel = channel;
  }
}

// Enforce channels store to be a singleton
const KEY = '__STORYBOOK_CHANNELS';
function getChannelsStore() {
  if (!global[KEY]) {
    global[KEY] = new ChannelsStore();
  }
  return global[KEY];
}

export default getChannelsStore();

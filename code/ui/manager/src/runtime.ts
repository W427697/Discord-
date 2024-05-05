import { global } from '@storybook/global';

import type { Channel } from '@storybook/core/dist/channels';
import type { AddonStore } from '@storybook/manager-api';
import { addons } from '@storybook/manager-api';
import type { Addon_Types, Addon_Config } from '@storybook/core/dist/types';
import { createBrowserChannel } from '@storybook/core/dist/channels';
import { CHANNEL_CREATED } from '@storybook/core/dist/core-events';
import Provider from './provider';
import { renderStorybookUI } from './index';

class ReactProvider extends Provider {
  addons: AddonStore;

  channel: Channel;

  constructor() {
    super();

    const channel = createBrowserChannel({ page: 'manager' });

    addons.setChannel(channel);

    channel.emit(CHANNEL_CREATED);

    this.addons = addons;
    this.channel = channel;
    global.__STORYBOOK_ADDONS_CHANNEL__ = channel;
  }

  getElements(type: Addon_Types) {
    return this.addons.getElements(type);
  }

  getConfig(): Addon_Config {
    return this.addons.getConfig();
  }

  handleAPI(api: unknown) {
    this.addons.loadAddons(api);
  }
}

const { document } = global;
const rootEl = document.getElementById('root');

// We need to wait for the script tag containing the global objects
// to be run by Webkit before rendering the UI. This is fine in most browsers.
setTimeout(() => {
  renderStorybookUI(rootEl, new ReactProvider());
}, 0);

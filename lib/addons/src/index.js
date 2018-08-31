// Resolves to window in browser and to global in node
import global from 'global';
import { TabWrapper } from '@storybook/components';
import channels from './channels-store';

export mockChannel from './storybook-channel-mock';
export { makeDecorator } from './make-decorator';

export class AddonStore {
  constructor() {
    this.loaders = {};
    this.panels = {};
    this.preview = null;
    this.database = null;
  }

  getChannel() {
    return channels.getChannel();
  }

  hasChannel() {
    return channels.hasChannel();
  }

  setChannel(channel) {
    channels.setChannel(channel);
  }

  getPreview() {
    return this.preview;
  }

  setPreview(preview) {
    this.preview = preview;
  }

  getDatabase() {
    return this.database;
  }

  setDatabase(database) {
    this.database = database;
  }

  getPanels() {
    return this.panels;
  }

  addPanel(name, panel) {
    // supporting legacy addons, which have not migrated to the active-prop
    const original = panel.render;
    if (original && original.toString() && !original.toString().match(/active/)) {
      this.panels[name] = {
        ...panel,
        render: ({ active }) => TabWrapper({ active, render: original }),
      };
    } else {
      this.panels[name] = panel;
    }
  }

  register(name, loader) {
    this.loaders[name] = loader;
  }

  loadAddons(api) {
    Object.keys(this.loaders)
      .map(name => this.loaders[name])
      .forEach(loader => loader(api));
  }
}

// Enforce addons store to be a singleton
const KEY = '__STORYBOOK_ADDONS';
function getAddonsStore() {
  if (!global[KEY]) {
    global[KEY] = new AddonStore();
  }
  return global[KEY];
}

export default getAddonsStore();

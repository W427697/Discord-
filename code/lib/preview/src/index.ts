/* eslint-disable no-underscore-dangle */

import * as ADDONS from './addons';
import * as CLIENT_API from './client-api';
import * as CORE_CLIENT from './core-client';
import * as PREVIEW_WEB from './preview-web';
import * as STORE from './store';
import * as CHANNELS from './channels';
import * as CHANNEL_POSTMESSAGE from './channel-websocket';
import * as CLIENT_LOGGER from './client-logger';
import * as COMPONENTS from './components';
import * as CORE_EVENTS from './core-events';

(globalThis as any).__STORYBOOK_MODULE_ADDONS__ = ADDONS;
(globalThis as any).__STORYBOOK_MODULE_CLIENT_API__ = CLIENT_API;
(globalThis as any).__STORYBOOK_MODULE_CORE_CLIENT__ = CORE_CLIENT;
(globalThis as any).__STORYBOOK_MODULE_PREVIEW_WEB__ = PREVIEW_WEB;
(globalThis as any).__STORYBOOK_MODULE_STORE__ = STORE;
(globalThis as any).__STORYBOOK_MODULE_CHANNELS__ = CHANNELS;
(globalThis as any).__STORYBOOK_MODULE_CHANNEL_POSTMESSAGE__ = CHANNEL_POSTMESSAGE;
(globalThis as any).__STORYBOOK_MODULE_CLIENT_LOGGER__ = CLIENT_LOGGER;
(globalThis as any).__STORYBOOK_MODULE_COMPONENTS__ = COMPONENTS;
(globalThis as any).__STORYBOOK_MODULE_CORE_EVENTS__ = CORE_EVENTS;

const element = document.getElementById('storybook-script');

if (element) {
  const { files } = element.dataset;

  if (files) {
    const sources = files.split(',').map((file) => file.trim());

    sources.forEach((source) => {
      const imported = document.createElement('script');
      imported.src = source;
      document.body.append(imported);
    });
  }
}

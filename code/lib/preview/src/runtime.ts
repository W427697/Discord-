import { TELEMETRY_ERROR } from '@storybook/core-events';
import { global } from '@storybook/global';

import * as CHANNELS from '@storybook/channels';
import * as CLIENT_LOGGER from '@storybook/client-logger';
import * as CORE_EVENTS from '@storybook/core-events';
import * as PREVIEW_API from '@storybook/preview-api';
import * as TYPES from '@storybook/types';
import * as GLOBAL from '@storybook/global';

// DEPRECATED, remove in 8.0
import * as ADDONS from '@storybook/preview-api/dist/addons';
import * as CLIENT_API from '@storybook/preview-api/dist/client-api';
import * as CORE_CLIENT from '@storybook/preview-api/dist/core-client';
import * as PREVIEW_WEB from '@storybook/preview-api/dist/preview-web';
import * as STORE from '@storybook/preview-api/dist/store';
import * as CHANNEL_POSTMESSAGE from '@storybook/channels/dist/postmessage/index';
import * as CHANNEL_WEBSOCKET from '@storybook/channels/dist/websocket/index';

import { prepareForTelemetry } from './utils';
import { globalPackages, globalsNameReferenceMap } from './globals';

// Here we map the name of a module to their VALUE in the global scope.
const globalsNameValueMap: Required<Record<keyof typeof globalsNameReferenceMap, any>> = {
  '@storybook/channels': CHANNELS,
  '@storybook/client-logger': CLIENT_LOGGER,
  '@storybook/core-events': CORE_EVENTS,
  '@storybook/preview-api': PREVIEW_API,
  '@storybook/global': GLOBAL,
  '@storybook/types': TYPES,

  // DEPRECATED, remove in 8.0
  '@storybook/channel-postmessage': CHANNEL_POSTMESSAGE,
  '@storybook/channel-websocket': CHANNEL_WEBSOCKET,
  '@storybook/addons': ADDONS,
  '@storybook/client-api': CLIENT_API,
  '@storybook/core-client': CORE_CLIENT,
  '@storybook/preview-web': PREVIEW_WEB,
  '@storybook/store': STORE,
};

// Apply all the globals
globalPackages.forEach((key) => {
  (global as any)[globalsNameReferenceMap[key]] = globalsNameValueMap[key];
});

global.sendTelemetryError = (error: any) => {
  const channel = global.__STORYBOOK_ADDONS_CHANNEL__;
  channel.emit(TELEMETRY_ERROR, prepareForTelemetry(error));
};

// handle all uncaught StorybookError at the root of the application and log to telemetry if applicable
global.addEventListener('error', (args: any) => {
  const error = args.error || args;
  if (error.fromStorybook) {
    global.sendTelemetryError(error);
  }
});
global.addEventListener('unhandledrejection', ({ reason }: any) => {
  if (reason.fromStorybook) {
    global.sendTelemetryError(reason);
  }
});

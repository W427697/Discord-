import * as CHANNEL_POSTMESSAGE from '@junk-temporary-prototypes/channel-postmessage';
import * as CHANNEL_WEBSOCKET from '@junk-temporary-prototypes/channel-websocket';
import * as CHANNELS from '@junk-temporary-prototypes/channels';
import * as CLIENT_LOGGER from '@junk-temporary-prototypes/client-logger';
import * as CORE_EVENTS from '@junk-temporary-prototypes/core-events';
import * as PREVIEW_API from '@junk-temporary-prototypes/preview-api';

// DEPRECATED, remove in 8.0
import * as ADDONS from '@junk-temporary-prototypes/preview-api/dist/addons';
import * as CLIENT_API from '@junk-temporary-prototypes/preview-api/dist/client-api';
import * as CORE_CLIENT from '@junk-temporary-prototypes/preview-api/dist/core-client';
import * as PREVIEW_WEB from '@junk-temporary-prototypes/preview-api/dist/preview-web';
import * as STORE from '@junk-temporary-prototypes/preview-api/dist/store';

import type { globals } from './types';

// Here we map the name of a module to their VALUE in the global scope.
export const values: Required<Record<keyof typeof globals, any>> = {
  '@junk-temporary-prototypes/channel-postmessage': CHANNEL_POSTMESSAGE,
  '@junk-temporary-prototypes/channel-websocket': CHANNEL_WEBSOCKET,
  '@junk-temporary-prototypes/channels': CHANNELS,
  '@junk-temporary-prototypes/client-logger': CLIENT_LOGGER,
  '@junk-temporary-prototypes/core-events': CORE_EVENTS,
  '@junk-temporary-prototypes/preview-api': PREVIEW_API,

  // DEPRECATED, remove in 8.0
  '@junk-temporary-prototypes/addons': ADDONS,
  '@junk-temporary-prototypes/client-api': CLIENT_API,
  '@junk-temporary-prototypes/core-client': CORE_CLIENT,
  '@junk-temporary-prototypes/preview-web': PREVIEW_WEB,
  '@junk-temporary-prototypes/store': STORE,
};

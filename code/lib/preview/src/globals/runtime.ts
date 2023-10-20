import * as CHANNEL_POSTMESSAGE from '@storybook/channels/dist/postmessage/index';
import * as CHANNEL_WEBSOCKET from '@storybook/channels/dist/websocket/index';
import * as CHANNELS from '@storybook/channels';
import * as CLIENT_LOGGER from '@storybook/client-logger';
import * as CORE_EVENTS from '@storybook/core-events';
import * as PREVIEW_API from '@storybook/preview-api';
import * as GLOBAL from '@storybook/global';

import type { globals } from './types';

// Here we map the name of a module to their VALUE in the global scope.
export const values: Required<Record<keyof typeof globals, any>> = {
  '@storybook/channel-postmessage': CHANNEL_POSTMESSAGE, // @deprecated: remove in 8.0
  '@storybook/channel-websocket': CHANNEL_WEBSOCKET, // @deprecated: remove in 8.0
  '@storybook/channels': CHANNELS,
  '@storybook/client-logger': CLIENT_LOGGER,
  '@storybook/core-events': CORE_EVENTS,
  '@storybook/preview-api': PREVIEW_API,
  '@storybook/global': GLOBAL,
};

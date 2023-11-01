import * as CHANNELS from '@storybook/channels';
import * as CLIENT_LOGGER from '@storybook/client-logger';
import * as CORE_EVENTS from '@storybook/core-events';
import * as PREVIEW_API from '@storybook/preview-api';
import * as GLOBAL from '@storybook/global';

import type { globals } from './types';

// Here we map the name of a module to their VALUE in the global scope.
export const values: Required<Record<keyof typeof globals, any>> = {
  '@storybook/channels': CHANNELS,
  '@storybook/client-logger': CLIENT_LOGGER,
  '@storybook/core-events': CORE_EVENTS,
  '@storybook/preview-api': PREVIEW_API,
  '@storybook/global': GLOBAL,
};

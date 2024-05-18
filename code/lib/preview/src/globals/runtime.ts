import * as GLOBAL from '@storybook/global';

import * as CHANNELS from '@storybook/core/dist/channels';
import * as CLIENT_LOGGER from '@storybook/core/dist/client-logger';
import * as CORE_EVENTS from '@storybook/core/dist/core-events';
import * as CORE_EVENTS_PREVIEW_ERRORS from '@storybook/core/dist/preview-errors';
import * as PREVIEW_API from '@storybook/core/dist/preview-api';
import * as TYPES from '@storybook/core/dist/types';

import type { globalsNameReferenceMap } from './globals';

// Here we map the name of a module to their VALUE in the global scope.
export const globalsNameValueMap: Required<Record<keyof typeof globalsNameReferenceMap, any>> = {
  '@storybook/global': GLOBAL,

  '@storybook/channels': CHANNELS,
  '@storybook/core/dist/channels': CHANNELS,

  '@storybook/client-logger': CLIENT_LOGGER,
  '@storybook/core/dist/client-logger': CLIENT_LOGGER,

  '@storybook/core-events': CORE_EVENTS,
  '@storybook/core/dist/core-events': CORE_EVENTS,

  '@storybook/core-events/preview-errors': CORE_EVENTS_PREVIEW_ERRORS,
  '@storybook/core/dist/preview-errors': CORE_EVENTS_PREVIEW_ERRORS,

  '@storybook/preview-api': PREVIEW_API,
  '@storybook/core/dist/preview-api': PREVIEW_API,

  '@storybook/types': TYPES,
  '@storybook/core/dist/types': TYPES,
};

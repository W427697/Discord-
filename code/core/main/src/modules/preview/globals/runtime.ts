import * as CHANNELS from '../../channels';
import * as EVENTS from '../../events';
import * as EVENTS_PREVIEW_ERRORS from '../../events/errors/preview-errors';
import * as INSTRUMENTER from '../../instrumenter';
import * as PREVIEW_API from '../../preview-api';
import * as TYPES from '../../types';
import * as CLIENT_LOGGER from '../../client-logger';

import type { globalsNameReferenceMap } from './globals';

// Here we map the name of a module to their VALUE in the global scope.
export const globalsNameValueMap: Required<Record<keyof typeof globalsNameReferenceMap, any>> = {
  '@storybook/channels': CHANNELS,
  '@storybook/core-events': EVENTS,
  '@storybook/core-events/preview-errors': EVENTS_PREVIEW_ERRORS,
  '@storybook/preview-api': PREVIEW_API,
  '@storybook/client-logger': CLIENT_LOGGER,
  '@storybook/types': TYPES,
  '@storybook/instrumenter': INSTRUMENTER,
  '@storybook/core/dist/modules/channels/index': CHANNELS,
  '@storybook/core/dist/modules/events/index': EVENTS,
  '@storybook/core/dist/modules/events/preview-errors': EVENTS_PREVIEW_ERRORS,
  '@storybook/core/dist/modules/preview-api/index': PREVIEW_API,
  '@storybook/core/dist/modules/client-logger/index': CLIENT_LOGGER,
  '@storybook/core/dist/modules/types/index': TYPES,
  '@storybook/core/dist/modules/instrumenter/index': INSTRUMENTER,
  '@storybook/global': globalThis,
};

import * as REACT from 'react';
import * as REACT_DOM from 'react-dom';

import * as COMPONENTS from '@storybook/components';
import * as ICONS from '@storybook/icons';
import * as MANAGER_API from '@storybook/manager-api';

import * as CHANNELS from '@storybook/core/dist/channels';
import * as EVENTS from '@storybook/core/dist/core-events';
import * as EVENTS_MANAGER_ERRORS from '@storybook/core/dist/manager-errors';
import * as ROUTER from '@storybook/core/dist/router';
import * as THEMING from '@storybook/core/dist/theming';
import * as THEMINGCREATE from '@storybook/core/dist/theming/create';
import * as TYPES from '@storybook/core/dist/types';
import * as CLIENT_LOGGER from '@storybook/core/dist/client-logger';

import type { globalsNameReferenceMap } from './globals';

// Here we map the name of a module to their VALUE in the global scope.
export const globalsNameValueMap: Required<Record<keyof typeof globalsNameReferenceMap, any>> = {
  react: REACT,
  'react-dom': REACT_DOM,
  '@storybook/components': COMPONENTS,
  '@storybook/icons': ICONS,
  '@storybook/manager-api': MANAGER_API,

  '@storybook/router': ROUTER,
  '@storybook/core/dist/router': ROUTER,

  '@storybook/theming': THEMING,
  '@storybook/core/dist/theming': THEMING,
  '@storybook/theming/create': THEMINGCREATE,
  '@storybook/core/dist/theming/create': THEMINGCREATE,

  '@storybook/channels': CHANNELS,
  '@storybook/core/dist/channels': CHANNELS,

  '@storybook/core-events': EVENTS,
  '@storybook/core/dist/core-events': EVENTS,

  '@storybook/types': TYPES,
  '@storybook/core/dist/types': TYPES,

  '@storybook/core-events/manager-errors': EVENTS_MANAGER_ERRORS,
  '@storybook/core/dist/manager-errors': EVENTS_MANAGER_ERRORS,

  '@storybook/client-logger': CLIENT_LOGGER,
  '@storybook/core/dist/client-logger': CLIENT_LOGGER,
};

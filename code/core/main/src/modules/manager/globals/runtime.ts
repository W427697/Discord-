import * as REACT from 'react';
import * as REACT_DOM from 'react-dom';

import * as ICONS from '@storybook/icons';

import * as COMPONENTS from '../../components';
import * as CHANNELS from '../../channels';
import * as EVENTS from '../../events';
import * as EVENTS_MANAGER_ERRORS from '../../events/errors/manager-errors';
import * as ROUTER from '../../router';
import * as THEMING from '../../theming';
import * as INSTRUMENTER from '../../instrumenter';
import * as MANAGER_API from '../../manager-api';
import * as TYPES from '../../types';
import * as CLIENT_LOGGER from '../../client-logger';

import type { globalsNameReferenceMap } from './globals';

// Here we map the name of a module to their VALUE in the global scope.
export const globalsNameValueMap: Required<Record<keyof typeof globalsNameReferenceMap, any>> = {
  react: REACT,
  'react-dom': REACT_DOM,
  '@storybook/icons': ICONS,

  '@storybook/components': COMPONENTS,
  '@storybook/channels': CHANNELS,
  '@storybook/core-events': EVENTS,
  '@storybook/core-events/manager-errors': EVENTS_MANAGER_ERRORS,
  '@storybook/router': ROUTER,
  '@storybook/theming': THEMING,
  '@storybook/manager-api': MANAGER_API,
  '@storybook/client-logger': CLIENT_LOGGER,
  '@storybook/types': TYPES,
  '@storybook/instrumenter': INSTRUMENTER,
  '@storybook/core/dist/modules/instrumenter/index': INSTRUMENTER,
  '@storybook/core/dist/modules/components/index': COMPONENTS,
  '@storybook/core/dist/modules/channels/index': CHANNELS,
  '@storybook/core/dist/modules/events/index': EVENTS,
  '@storybook/core/dist/modules/events/manager-errors': EVENTS_MANAGER_ERRORS,
  '@storybook/core/dist/modules/router/index': ROUTER,
  '@storybook/core/dist/modules/theming/index': THEMING,
  '@storybook/core/dist/modules/manager-api/index': MANAGER_API,
  '@storybook/core/dist/modules/client-logger/index': CLIENT_LOGGER,
  '@storybook/core/dist/modules/types/index': TYPES,
};

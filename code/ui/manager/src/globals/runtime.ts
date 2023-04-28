import * as REACT from 'react';
import * as REACTDOM from 'react-dom';

import * as STORYBOOKCOMPONENTS from '@junk-temporary-prototypes/components';
import * as STORYBOOKCHANNELS from '@junk-temporary-prototypes/channels';
import * as STORYBOOKEVENTS from '@junk-temporary-prototypes/core-events';
import * as STORYBOOKROUTER from '@junk-temporary-prototypes/router';
import * as STORYBOOKTHEMING from '@junk-temporary-prototypes/theming';
import * as STORYBOOKMANAGERAPI from '@junk-temporary-prototypes/manager-api';
import * as STORYBOOKCLIENTLOGGER from '@junk-temporary-prototypes/client-logger';

import type { Keys } from './types';

// Here we map the name of a module to their VALUE in the global scope.
export const values: Required<Record<keyof typeof Keys, any>> = {
  react: REACT as any,
  'react-dom': REACTDOM,
  '@junk-temporary-prototypes/components': STORYBOOKCOMPONENTS,
  '@junk-temporary-prototypes/channels': STORYBOOKCHANNELS,
  '@junk-temporary-prototypes/core-events': STORYBOOKEVENTS,
  '@junk-temporary-prototypes/router': STORYBOOKROUTER,
  '@junk-temporary-prototypes/theming': STORYBOOKTHEMING,
  '@junk-temporary-prototypes/api': STORYBOOKMANAGERAPI, // deprecated, remove in 8.0
  '@junk-temporary-prototypes/manager-api': STORYBOOKMANAGERAPI,
  // backwards compatibility
  '@junk-temporary-prototypes/addons': {
    addons: STORYBOOKMANAGERAPI.addons,
    types: STORYBOOKMANAGERAPI.types,
    mockChannel: STORYBOOKMANAGERAPI.mockChannel,
  },
  '@junk-temporary-prototypes/client-logger': STORYBOOKCLIENTLOGGER,
};

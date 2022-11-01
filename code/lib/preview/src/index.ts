/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
import global from 'global';

import * as ADDONS from './addons';
import * as CLIENT_API from './client-api';
import * as CORE_CLIENT from './core-client';
import * as PREVIEW_WEB from './preview-web';
import * as STORE from './store';

global.__STORYBOOK_ADDONS__ = ADDONS;
global.__STORYBOOK_CLIENT_API__ = CLIENT_API;
global.__STORYBOOK_CORE_CLIENT__ = CORE_CLIENT;
global.__STORYBOOK_PREVIEW_WEB__ = PREVIEW_WEB;
global.__STORYBOOK_STORE__ = STORE;

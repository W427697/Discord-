/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
import global from 'global';

import * as ADDONS from './addons';
import * as CLIENT_API from './client-api';
import * as CORE_CLIENT from './core-client';
import * as PREVIEW_WEB from './preview-web';
import * as STORE from './store';

global.__STORYBOOK_MODULE_ADDONS__ = ADDONS;
global.__STORYBOOK_MODULE_CLIENT_API__ = CLIENT_API;
global.__STORYBOOK_MODULE_CORE_CLIENT__ = CORE_CLIENT;
global.__STORYBOOK_MODULE_PREVIEW_WEB__ = PREVIEW_WEB;
global.__STORYBOOK_MODULE_STORE__ = STORE;

const element = document.getElementById('storybook-script');

if (element) {
  const { files } = element.dataset;

  if (files) {
    const sources = files.split(',').map((file) => file.trim());

    sources.forEach((source) => {
      const imported = document.createElement('script');
      imported.src = source;
      document.body.append(imported);
    });
  }
}

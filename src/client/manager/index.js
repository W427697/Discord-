import { createStore, combineReducers } from 'redux';
import { createApp } from 'mantra-core';
import buildContext from './configs/context.js';
import UUID from 'uuid';

import uiModule from './modules/ui';
import previewModule from './modules/preview';

const reducer = combineReducers({
  core: (state = {}) => state,
  ...previewModule.reducers,
});
const dataId = UUID.v4();

const reduxStore = createStore(reducer, {
  core: { dataId },
});

const context = buildContext(reduxStore);
const app = createApp(context);
app.loadModule(uiModule);
app.loadModule(previewModule);
app.init();

import { createStore, combineReducers } from 'redux';
import { createApp } from 'mantra-core';
import buildContext from './configs/context.js';
import UUID from 'uuid';

import uiModule from './modules/ui';
import previewModule from './modules/preview';

const dataId = UUID.v4();

const reducer = combineReducers({
  core: () => ({ dataId }),
  ...previewModule.reducers,
  ...uiModule.reducers,
});

const reduxStore = createStore(reducer);

const context = buildContext(reduxStore);
const app = createApp(context);
app.loadModule(previewModule);
app.loadModule(uiModule);
app.init();

import { creatStore } from 'redux';
import { createApp } from 'mantra-core';
import buildContext from './configs/context.js';
import UUID from 'uuid';

const reducer = (state) => (state);
const dataId = UUID.v4();

const reduxStore = creatStore(reducer, {
  core: { dataId },
});

const context = buildContext(reduxStore);
const app = createApp(context);
app.init();

import Preview from '../components/preview.js';
import { useDeps, compose, composeAll } from 'mantra-core';

export const composer = ({ context }, onData) => {
  const { reduxStore } = context();
  // Here we are sure that, Redux store initialize with the dataId.
  // So that's why don't need to subscribe here.
  const state = reduxStore.getState();
  const url = `iframe.html?dataId=${state.core.dataId}`;
  onData(null, { url });
};

export default composeAll(
  compose(composer),
  useDeps()
)(Preview);

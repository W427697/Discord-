import Layout from '../components/layout';
import { useDeps, compose, composeAll } from 'mantra-core';
import pick from 'lodash.pick';

export const composer = ({ context }, onData) => {
  const { reduxStore } = context();

  const processState = () => {
    const { shortcuts } = reduxStore.getState();
    const data = pick(shortcuts, 'showLeftPanel', 'showDownPanel', 'goFullScreen');
    onData(null, data);
  };

  processState();
  reduxStore.subscribe(processState);
};

export default composeAll(
  compose(composer),
  useDeps()
)(Layout);

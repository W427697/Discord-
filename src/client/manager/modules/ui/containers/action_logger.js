import ActionLogger from '../components/action_logger';
import { useDeps, compose, composeAll } from 'mantra-core';

export const composer = ({ context, actions }, onData) => {
  const { reduxStore } = context();
  const actionMap = actions();

  const processState = () => {
    const { api } = reduxStore.getState();
    const data = {
      onClear: actionMap.api.clearActions,
      actions: [],
    };

    if (api && api.actions) {
      data.actions = api.actions;
    }

    onData(null, data);
  };

  processState();
  reduxStore.subscribe(processState);
};

export default composeAll(
  compose(composer),
  useDeps()
)(ActionLogger);

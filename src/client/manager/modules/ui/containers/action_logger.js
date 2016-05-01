import ActionLogger from '../components/action_logger';
import { useDeps, compose, composeAll } from 'mantra-core';

export const composer = ({ context, actions }, onData) => {
  const { reduxStore } = context();
  const actionMap = actions();

  const processState = () => {
    const { preview } = reduxStore.getState();
    const data = {
      onClear: actionMap.preview.clearActions,
      actions: [],
    };

    if (preview && preview.actions) {
      data.actions = preview.actions;
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

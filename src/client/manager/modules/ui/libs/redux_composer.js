import { compose } from 'mantra-core';

export default function reduxComposer(fn) {
  const baseComposer = (props, onData) => {
    const { reduxStore } = props.context();

    const processState = () => {
      try {
        const state = reduxStore.getState();
        const data = fn(state, props);
        onData(null, data);
      } catch (ex) {
        onData(ex);
      }
    };

    processState();
    reduxStore.subscribe(processState);
  };

  return compose(baseComposer);
}

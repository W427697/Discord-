import LeftPanel from '../components/left_panel';
import { useDeps, compose, composeAll } from 'mantra-core';
import pick from 'lodash.pick';

export const composer = ({ context, actions }, onData) => {
  const { reduxStore } = context();
  const actionMap = actions();

  const processState = () => {
    const { preview } = reduxStore.getState();
    if (preview) {
      const data = pick(preview, 'stories', 'selectedStory', 'selectedKind');
      data.onSelectStory = actionMap.preview.selectStory;
      onData(null, data);
    } else {
      onData(null, {});
    }
  };

  processState();
  reduxStore.subscribe(processState);
};

export default composeAll(
  compose(composer),
  useDeps()
)(LeftPanel);

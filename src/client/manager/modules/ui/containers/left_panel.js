import LeftPanel from '../components/left_panel';
import { useDeps, compose, composeAll } from 'mantra-core';
import pick from 'lodash.pick';
import * as filters from '../libs/filters';

export const composer = ({ context, actions }, onData) => {
  const { reduxStore } = context();
  const actionMap = actions();

  const processState = () => {
    const { preview, ui } = reduxStore.getState();
    if (preview) {
      const { stories, selectedKind, selectedStory} = preview;
      const { storyFilter } = ui;
      const data = {
        stories: filters.storyFilter(stories, storyFilter, selectedKind, selectedStory),
        selectedKind,
        selectedStory,
        onSelectStory: actionMap.preview.selectStory,

        storyFilter,
        onStoryFilter: actionMap.ui.setStoryFilter,
      };
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

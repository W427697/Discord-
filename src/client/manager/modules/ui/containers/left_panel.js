import LeftPanel from '../components/left_panel';
import { useDeps, compose, composeAll } from 'mantra-core';
import * as filters from '../libs/filters';

export const composer = ({ context, actions }, onData) => {
  const { reduxStore } = context();
  const actionMap = actions();

  const processState = () => {
    const { api, ui } = reduxStore.getState();
    if (api) {
      const { stories, selectedKind, selectedStory } = api;
      const { storyFilter } = ui;
      const data = {
        stories: filters.storyFilter(stories, storyFilter, selectedKind, selectedStory),
        selectedKind,
        selectedStory,
        onSelectStory: actionMap.api.selectStory,

        storyFilter,
        onStoryFilter: actionMap.ui.setStoryFilter,

        openShortcutsHelp: actionMap.ui.toggleShortcutsHelp,
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

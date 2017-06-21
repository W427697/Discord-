import { connect } from 'react-redux';
import LeftPanel from '../components/LeftPanel';

/*
export const mapper = (state, props, { actions }) => {
  const actionMap = actions();
  const { stories, selectedKind, selectedStory, uiOptions, storyFilter } = state;
  const { name, url, sortStoriesByKind } = uiOptions;

  const data = {
    stories: filters.storyFilter(stories, storyFilter, selectedKind, sortStoriesByKind),
    selectedKind,
    selectedStory,
    onSelectStory: actionMap.api.selectStory,

    storyFilter,
    onStoryFilter: actionMap.ui.setStoryFilter,

    openShortcutsHelp: actionMap.ui.toggleShortcutsHelp,
    name,
    url,
  };

  return data;
};
*/

const mapStateToProps = state => ({
  ...state,
});

export default connect(mapStateToProps)(LeftPanel);

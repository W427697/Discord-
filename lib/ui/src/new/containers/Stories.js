import { connect } from 'react-redux';
import Stories from '../components/Stories';

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
  stories: state.stories,
});

const mapDispatchToPros = {};

export default connect(mapStateToProps, mapDispatchToPros)(Stories);

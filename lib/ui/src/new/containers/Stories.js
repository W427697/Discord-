import fuzzysearch from 'fuzzysearch';
import { connect } from 'react-redux';
import set from 'lodash.set';
import Stories from '../components/Stories';
import { selectStory } from '../actions';

const mapStateToProps = state => {
  const selectedKind = state.ui.selectedKind;
  // const selectedStory = state.ui.selectedStory;

  // filter
  const storiesToRender = state.stories.filter(story => {
    if (story.kind === selectedKind) return true;
    const needle = state.ui.storyFilter.toLocaleLowerCase();
    const hstack = story.kind.toLocaleLowerCase();
    return fuzzysearch(needle, hstack);
  });

  const transformedStories = {};
  storiesToRender.forEach(({ kind, stories }) => {
    const parts = kind.split('/');
    set(transformedStories, parts.concat('stories'), stories);
    parts.forEach((part, index) => {
      const subParts = parts.slice(0, index + 1);
      set(transformedStories, subParts.concat('name'), subParts.join('/'));
    });
  });

  return {
    selectedKind: state.ui.selectedKind,
    selectedStory: state.ui.selectedStory,
    stories: transformedStories,
  };
};

const mapDispatchToPros = {
  onSelectStory: selectStory,
};

export default connect(mapStateToProps, mapDispatchToPros)(Stories);

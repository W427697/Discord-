import { connect } from 'react-redux';
import set from 'lodash.set';
import Stories from '../components/Stories';
import { selectStory } from '../actions/ui';

const mapStateToProps = state => {
  const transformedStories = {};
  state.stories.forEach(({ kind, stories }) => {
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

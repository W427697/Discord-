import { connect } from 'react-redux';
import SearchBox from '../components/SearchBox';
import { selectStory, toggleSearchBox } from '../actions';

// export const mapper = (state, props, { actions }) => {
//   const actionMap = actions();
//   return {
//     showSearchBox: state.shortcutOptions.showSearchBox,
//     stories: state.stories,
//     // onSelectStory: actionMap.api.selectStory,
//     // handleEvent: actionMap.shortcuts.handleEvent,
//   };
// };

const mapStateToProps = state => ({
  stories: state.stories,
  showSearchBox: state.ui.showSearchBox,
});

const mapDisptchToProps = dispatch => ({
  onSelectStory: (kind, story) => {
    dispatch(selectStory(kind, story));
    dispatch(toggleSearchBox(false));
  },
});

export default connect(mapStateToProps, mapDisptchToProps)(SearchBox);

import { connect } from 'react-redux';
import SearchBox from '../components/SearchBox';

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

export default connect(mapStateToProps)(SearchBox);

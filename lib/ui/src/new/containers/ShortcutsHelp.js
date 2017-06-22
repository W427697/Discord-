import { window } from 'global';
import { connect } from 'react-redux';
import ShortcutsHelp from '../components/ShortcutsHelp';
import { toggleShortcutsHelp } from '../actions';

// export const mapper = (state, props, { actions }) => {
//   const actionMap = actions();
//   const data = {
//     isOpen: state.showShortcutsHelp,
//     onClose: actionMap.ui.toggleShortcutsHelp,
//     platform: window.navigator.platform.toLowerCase(),
//   };

//   return data;
// };

const mapStateToProps = state => ({
  isOpen: state.ui.showShortcutsHelp,
});

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(toggleShortcutsHelp(false)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShortcutsHelp);

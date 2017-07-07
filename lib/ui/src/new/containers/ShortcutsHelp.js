import { window } from 'global';
import { connect } from 'react-redux';
import ShortcutsHelp from '../components/ShortcutsHelp';
import { toggleShortcutsHelp } from '../actions';

const mapStateToProps = state => ({
  isOpen: state.ui.showShortcutsHelp,
  platform: window.navigator.platform.toLowerCase(),
});

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(toggleShortcutsHelp(false)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShortcutsHelp);

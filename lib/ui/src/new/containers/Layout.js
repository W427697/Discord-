import { connect } from 'react-redux';
import Layout from '../components/Layout';

// export const mapper = ({ shortcutOptions }) =>
//   pick(shortcutOptions, 'showLeftPanel', 'showDownPanel', 'goFullScreen', 'downPanelInRight');

const mapStateToProps = state => ({
  ...state.ui,
});

export default connect(mapStateToProps)(Layout);

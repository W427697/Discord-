import { connect } from 'react-redux';
import DownPanel from '../components/DownPanel';
import { selectPanel } from '../actions';

const mapStateToProps = (state, { provider }) => ({
  panels: provider.getPanels(),
  selectedPanel: state.ui.selectedPanel,
});

const mapDispatchToProps = {
  onPanelSelect: selectPanel,
};

export default connect(mapStateToProps, mapDispatchToProps)(DownPanel);

import { connect } from 'react-redux';
import LeftPanel from '../components/LeftPanel';

const mapStateToProps = state => ({
  ...state,
});

export default connect(mapStateToProps)(LeftPanel);

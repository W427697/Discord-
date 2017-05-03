import React from 'react';
import PropTypes from 'prop-types';
import { rootStyle, fullScreenPreviewStyle } from './commonLayoutStyles';

const leftPanelStyle = {
  display: 'block',
  width: '100%',
};

const contentPanelStyle = {
  position: 'relative',
  boxSizing: 'border-box',
  width: '100%',
  height: '100%',
  padding: '0',
};

const downPanelStyle = {
  display: 'flex',
  position: 'absolute',
  width: '100%',
  height: '100%',
  padding: '10px',
  boxSizing: 'border-box',
};

const normalPreviewStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: '#FFF',
  borderTop: '1px solid #ECECEC',
};

class LayoutMobile extends React.Component {
  render() {
    const {
      goFullScreen,
      showLeftPanel,
      showDownPanel,
      downPanel,
      leftPanel,
      preview,
    } = this.props;
    const previewStyle = goFullScreen ? fullScreenPreviewStyle : normalPreviewStyle;
    return (
      <div style={rootStyle}>
        <div style={leftPanelStyle}>
          {showLeftPanel && leftPanel()}
        </div>
        <div style={contentPanelStyle}>
          <div style={previewStyle}>
            {preview()}
          </div>
        </div>
        <div style={downPanelStyle}>
          {showDownPanel ? downPanel() : null}
        </div>
      </div>
    );
  }
}

LayoutMobile.propTypes = {
  showLeftPanel: PropTypes.bool.isRequired,
  showDownPanel: PropTypes.bool.isRequired,
  goFullScreen: PropTypes.bool.isRequired,
  leftPanel: PropTypes.func.isRequired,
  preview: PropTypes.func.isRequired,
  downPanel: PropTypes.func.isRequired,
};

export default LayoutMobile;

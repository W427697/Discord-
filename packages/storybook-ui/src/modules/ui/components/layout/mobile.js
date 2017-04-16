import React, { PropTypes } from 'react';

const rootStyle = {
  height: '100%',
  backgroundColor: '#F7F7F7',
};

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

const fullScreenPreviewStyle = {
  position: 'fixed',
  left: '0px',
  right: '0px',
  top: '0px',
  zIndex: 1,
  backgroundColor: '#FFF',
  height: '100%',
  width: '100%',
  border: 0,
  margin: 0,
  padding: 0,
  overflow: 'hidden',
};

class LayoutMobile extends React.Component {
  render() {
    const {
      goFullScreen,
      showLeftPanel,
      showDownPanel,
      downPanelInRight,
      downPanel,
      leftPanel,
      preview,
    } = this.props;
    const previewStyle = goFullScreen ? fullScreenPreviewStyle : normalPreviewStyle;
    if (showDownPanel) {
    const downPanelDefaultSize = 200;
    }
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

import React from 'react';

import VSplit from './vsplit';
import HSplit from './hsplit';
import SplitPane from '@kadira/react-split-pane';

const rootStyles = {
  height: '100vh',
  backgroundColor: '#F7F7F7',
};

const leftPanelStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
};

const downPanelStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  padding: '5px 10px 10px 0',
  boxSizing: 'border-box',
};

const contentPanelStyle = {
  position: 'absolute',
  boxSizing: 'border-box',
  width: '100%',
  height: '100%',
  padding: '10px 10px 10px 0',
};

const previewStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: '#FFF',
  border: '1px solid #ECECEC',
  borderRadius: 4,
};

const vsplit = <VSplit />;
const hsplit = <HSplit />;

const onDragStart = function () {
  document.body.classList.add('dragging');
};

const onDragEnd = function () {
  document.body.classList.remove('dragging');
};

const Layout = (props) => (
  <div style={rootStyles}>
    <SplitPane
      split="vertical"
      minSize={250}
      resizerChildren={vsplit}
      onDragStarted={onDragStart}
      onDragFinished={onDragEnd}
    >
      <div style={leftPanelStyle}>
        {props.leftPanel()}
      </div>

      <SplitPane
        split="horizontal"
        primary="second"
        minSize={100}
        defaultSize={200}
        resizerChildren={hsplit}
        onDragStarted={onDragStart}
        onDragFinished={onDragEnd}
      >
        <div style={contentPanelStyle}>
          <div style={previewStyle}>
            {props.preview()}
          </div>
        </div>
        <div style={downPanelStyle}>
          {props.downPanel()}
        </div>
      </SplitPane>
    </SplitPane>
  </div>
);

Layout.propTypes = {
  leftPanel: React.PropTypes.func.isRequired,
  preview: React.PropTypes.func.isRequired,
  downPanel: React.PropTypes.func.isRequired,
};

export default Layout;

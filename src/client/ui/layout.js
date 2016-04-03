import React from 'react';
import ReactDOM from 'react-dom';
import SizeButton from './size-button';

const sizes = {
  iphone4: {
    width: 320,
    height: 480,
  },
  samsungS5: {
    width: 360,
    height: 640,
  },
  iphone6: {
    width: 375,
    height: 667,
  },
};

class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isControlOpen: true,
      isActionLoggerOpen: true,
      isIframeCoverHidden: true,
      viewportHeight: 500,
      viewportWidth: 400,
      origClientX: 0,
      dragging: false,
    };

    this.toggleControls = this.toggleControls.bind(this);
    this.toggleActionLogger = this.toggleActionLogger.bind(this);
    this.toggleIframeCover = this.toggleIframeCover.bind(this);

    this.updateHeight = this.updateHeight.bind(this);
    this.updateViewportWidth = this.updateViewportWidth.bind(this);
    this.updateViewportHeight = this.updateViewportHeight.bind(this);
    this.updateOrigClientX = this.updateOrigClientX.bind(this);

    this.handleOnMouseDownResizer = this.handleOnMouseDownResizer.bind(this);
    this.handleOnMouseMove = this.handleOnMouseMove.bind(this);
    this.handleOnMouseUp = this.handleOnMouseUp.bind(this);
    this.handleOnChangeWidthInput = this.handleOnChangeWidthInput.bind(this);
    this.handleOnChangeHeightInput = this.handleOnChangeHeightInput.bind(this);
    this.handleOnClickSizeBtn = this.handleOnClickSizeBtn.bind(this);
  }

  componentWillMount() {
    this.updateHeight();
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.handleOnMouseMove);
    window.addEventListener('mouseup', this.handleOnMouseUp);
    window.addEventListener('resize', this.updateHeight);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleOnMouseMove);
    window.removeEventListener('mouseup', this.handleOnMouseUp);
    window.removeEventListener('resize', this.updateHeight);
  }

  updateViewportWidth(viewportWidth) {
    /*
    // so far i didn't any anomalies
    // can be removed if there's no issue
    const resizer = this.refs.manualResizer;
    const resizerEl = ReactDOM.findDOMNode(resizer);
    const currentXPos = resizerEl.getBoundingClientRect().left;
    this.updateOrigClientX(currentXPos);
    */

    this.setState({
      viewportWidth,
    });

    return;
  }

  updateViewportHeight(viewportHeight) {
    this.setState({
      viewportHeight,
    });
  }

  updateHeight() {
    const { documentElement, body } = document;
    let height = documentElement.clientHeight || body.clientHeight;
    height -= 20;
    this.setState({ height });
  }

  updateOrigClientX(coord) {
    this.setState({
      origClientX: coord,
    });
  }

  toggleControls() {
    this.setState({
      isControlOpen: !this.state.isControlOpen,
    });
  }

  toggleActionLogger() {
    this.setState({
      isActionLoggerOpen: !this.state.isActionLoggerOpen,
    });
  }

  toggleIframeCover() {
    this.setState({
      isIframeCoverHidden: !this.state.isIframeCoverHidden,
    });
  }

  handleOnMouseDownResizer(event) {
    this.updateOrigClientX(event.clientX);

    // make cover visible so that mouse pointer doesn't
    // go into iframe
    this.toggleIframeCover();

    this.setState({
      dragging: true,
    });
  }

  handleOnMouseMove(event) {
    if (this.state.dragging) {
      const currentPos = event.clientX;
      const origPos = parseInt(this.state.origClientX);
      const diffPos = currentPos - origPos;
      const currentViewportWidth = parseInt(this.state.viewportWidth);
      const newViewportWidth = currentViewportWidth + diffPos;

      this.updateOrigClientX(currentPos);
      this.updateViewportWidth(newViewportWidth);
    }
  }

  handleOnMouseUp() {
    if (this.state.dragging) {
      // hide iframe cover to enable iframe interaction
      this.toggleIframeCover();

      this.setState({
        dragging: false,
      });
    }
  }

  handleOnChangeWidthInput(event) {
    this.updateViewportWidth(event.target.value);
  }

  handleOnChangeHeightInput(event) {
    this.updateViewportHeight(event.target.value);
  }

  handleOnClickSizeBtn(size) {
    const height = sizes[size].height;
    const width = sizes[size].width;

    this.updateViewportHeight(height);
    this.updateViewportWidth(width);
  }

  render() {
    const {
      controls,
      preview,
      actionLogger,
    } = this.props;

    const {
      height,
      viewportWidth,
      viewportHeight,
      isControlOpen,
      isActionLoggerOpen,
      isIframeCoverHidden,
    } = this.state;

    const rootStyles = {
      height,
      padding: 8,
      backgroundColor: '#F7F7F7',
    };

    let controlsStyle = {
      position: 'fixed',
      top: 0,
      left: -240,
      bottom: 0,
      width: 240,
      overflowY: 'auto',
    };

    let actionStyle = {
      position: 'fixed',
      bottom: -150,
      width: '100%',
      height: 150,
    };

    let previewStyle = {
      height: height - 16,
      border: '1px solid #ECECEC',
      borderRadius: 4,
      padding: 5,
      backgroundColor: '#FFF',
    };

    const toggleStyle = {
      display: 'block',
      height: '36px',
      overflow: 'hidden',
    };

    const iframeStyle = {
      width: `${viewportWidth}px`,
      height: `${viewportHeight}px`,
      margin: '0 auto',
    };

    let iframeCoverStyle = {
      display: 'initial',
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 200,
    };

    const manualResizerStyle = {
      width: '5px',
      height: '100%',
      backgroundColor: 'red',
      borderTop: '2px solid red',
      borderBottom: '2px solid red',
      display: 'inline-block',
      cursor: 'col-resize',
    };

    if (isControlOpen) {
      controlsStyle = {
        ...controlsStyle,
        left: 0,
      };

      actionStyle = {
        ...actionStyle,
        marginLeft: 250,
      };

      previewStyle = {
        ...previewStyle,
        marginLeft: 250,
      };
    }

    if (isActionLoggerOpen) {
      actionStyle = {
        ...actionStyle,
        bottom: 0,
      };

      previewStyle = {
        ...previewStyle,
        height: height - actionStyle.height - 16,
      };
    }

    if (isIframeCoverHidden) {
      iframeCoverStyle = {
        ...iframeCoverStyle,
        display: 'none',
      };
    }

    return (
      <div style={rootStyles}>
        <div style={controlsStyle}>
          {controls}
        </div>
        <div style={previewStyle}>
          <div style={toggleStyle}>
            <input
              type="number"
              value={viewportWidth}
              placeholder="width"
              onChange={this.handleOnChangeWidthInput}
            />
            <input
              type="number"
              value={viewportHeight}
              placeholder="height"
              onChange={this.handleOnChangeHeightInput}
            />
            <button onClick={this.toggleControls}>
              toggle controls
            </button>
            <button onClick={this.toggleActionLogger}>
              toggle action
            </button>
            <SizeButton
              type="iphone4"
              label="iPhone 4"
              onClick={this.handleOnClickSizeBtn}
            />
            <SizeButton
              type="samsungS5"
              label="Samsung S5"
              onClick={this.handleOnClickSizeBtn}
            />
            <SizeButton
              type="iphone6"
              label="iPhone 6"
              onClick={this.handleOnClickSizeBtn}
            />
          </div>
          <div style={iframeCoverStyle}></div>
          <div style={iframeStyle}>
            {preview}
            <div
              ref="manualResizer"
              style={manualResizerStyle}
              onMouseDown={this.handleOnMouseDownResizer}
            ></div>
          </div>
        </div>
        <div style={actionStyle}>
          {actionLogger}
        </div>
      </div>
    );
  }
}

Layout.propTypes = {
  controls: React.PropTypes.element.isRequired,
  preview: React.PropTypes.element.isRequired,
  actionLogger: React.PropTypes.element.isRequired,
};

export default Layout;

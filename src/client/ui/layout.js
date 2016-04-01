import React from 'react';

class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isControlOpen: true,
      isActionLoggerOpen: true,
      viewportHeight: '500',
      viewportWidth: '400',
    };

    this.toggleControls = this.toggleControls.bind(this);
    this.toggleActionLogger = this.toggleActionLogger.bind(this);
    this.updateHeight = this.updateHeight.bind(this);
    this.updateViewportWidth = this.updateViewportWidth.bind(this);
    this.updateViewportHeight = this.updateViewportHeight.bind(this);
  }

  componentWillMount() {
    this.updateHeight();
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateHeight);
  }

  updateSizeReading(size) {

  }

  updateViewportWidth(event) {
    event.preventDefault();

    this.setState({
      viewportWidth: event.target.value,
    });

    return;
  }

  updateViewportHeight(event) {
    event.preventDefault();

    this.setState({
      viewportHeight: event.target.value,
    });

    return;
  }

  updateHeight() {
    const { documentElement, body } = document;
    let height = documentElement.clientHeight || body.clientHeight;
    height -= 20;
    this.setState({ height });
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

  render() {
    const { controls, preview, actionLogger } = this.props;
    const { height, viewportWidth, viewportHeight, isControlOpen, isActionLoggerOpen } = this.state;

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
              onChange={this.updateViewportWidth}
            />
            <input
              type="number"
              value={viewportHeight}
              placeholder="height"
              onChange={this.updateViewportHeight}
            />
            <button onClick={this.toggleControls}>
              toggle controls
            </button>
            <button onClick={this.toggleActionLogger}>
              toggle action
            </button>
          </div>
          <div style={iframeStyle}>
            {preview}
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

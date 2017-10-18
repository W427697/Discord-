import glamorous from 'glamorous';
import { window, document } from 'global';
import React, { Component, Children } from 'react';

/* eslint-disable react/no-multi-comp, react/prop-types */

class PanelGroup extends Component {
  static defaultProps = {
    spacing: 1,
    direction: 'row',
    showHandles: true,
    panelWidths: [],
  };

  constructor(props) {
    super(props);

    this.state = this.loadPanels(props);
    // debugger; // eslint-disable-line
  }

  // reload panel configuration if props update
  componentWillReceiveProps(nextProps) {
    const { panels } = this.state;
    const { nextPanels } = nextProps;

    // Only update from props if we're supplying the props in the first place
    if (nextPanels && nextPanels.length) {
      // if the panel array is a different size we know to update
      if (panels.length !== nextPanels.length) {
        this.setState(this.loadPanels(nextProps));
      } else {
        // otherwise we need to iterate to spot any difference
        for (let i = 0; i < nextPanels.length; i += 1) {
          if (
            panels[i].size !== nextPanels[i].size ||
            panels[i].minSize !== nextPanels[i].minSize ||
            panels[i].resize !== nextPanels[i].resize
          ) {
            this.setState(this.loadPanels(nextProps));
            break;
          }
        }
      }
    }
  }

  // Pass internal state out if there's a callback for it
  // Useful for saving panel configuration
  onUpdate(panels) {
    const { onUpdate } = this.props;
    if (onUpdate) {
      onUpdate.call(this, panels.slice());
    }
  }

  // For styling, track which direction to apply sizing to
  getSizeDirection(caps) {
    const { direction } = this.props;

    const result = direction === 'column' ? 'height' : 'width';

    return caps ? result[0].toUpperCase() + result.slice(1) : result;
  }

  // Hard-set a panel's size
  // Used to recalculate a stretchy panel when the window is resized
  setPanelSize(panelIndex, position, callback) {
    const { panels } = this.state;
    const { direction } = this.props;
    const size = direction === 'column' ? position.y : position.x;

    if (size !== panels[panelIndex].size) {
      const tempPanels = panels;
      tempPanels[panelIndex].size = size;
      this.setState({ panels: tempPanels });

      if (panelIndex > 0) {
        this.handleResize(panelIndex - 1, { x: 0, y: 0 });
      } else if (panels.length > 2) {
        this.handleResize(panelIndex + 1, { x: 0, y: 0 });
      }

      if (callback) {
        callback();
      }
    }
  }

  // Utility function for getting min pixel size of panel
  getPanelMinSize(panelIndex, panels) {
    const { resize, fixedSize, size, minSize } = panels[panelIndex];

    return resize === 'fixed' ? fixedSize || size : minSize;
  }

  // Utility function for getting max pixel size of panel
  getPanelMaxSize(panelIndex, panels) {
    const { resize, fixedSize, size } = panels[panelIndex];

    return resize === 'fixed' ? fixedSize || size : 0;
  }

  // Utility function for getting min pixel size of the entire panel group
  getPanelGroupMinSize(spacing) {
    const { panels } = this.state;
    return (
      this.state.panels.reduce((acc, item, index) => acc + this.getPanelMinSize(index, panels), 0) +
      (panels.length - 1) * spacing
    );
  }

  // load provided props into state
  loadPanels({ children, panelWidths }) {
    const defaultSize = 256;
    const defaultMinSize = 48;
    const defaultResize = 'stretch';

    return {
      panels: Children.toArray(children).map((item, index) => {
        const {
          size = defaultSize,
          minSize = defaultMinSize,
          snap = [],
          resize = panelWidths[index].size ? 'dynamic' : defaultResize,
        } = panelWidths[index];

        const result = { size, minSize, resize, snap };
        if (resize === 'fixed') {
          result.fixedSize = size || minSize;
        }
        return result;
      }),
    };
  }

  // Render component

  // Entry point for resizing panels.
  // We clone the panel array and perform operations on it so we can
  // setState after the recursive operations are finished
  handleResize(i, delta) {
    const tempPanels = this.state.panels.slice();
    const returnDelta = this.resizePanel(
      i,
      this.props.direction === 'row' ? delta.x : delta.y,
      tempPanels
    );
    this.setState({ panels: tempPanels });
    this.onUpdate(tempPanels);
    return returnDelta;
  }

  enableResize() {
    this.setState({
      resizing: true,
    });
  }

  disableResize() {
    this.setState({
      resizing: false,
    });
  }

  // Recursive panel resizing so we can push other panels out of the way
  // if we've exceeded the target panel's extents
  resizePanel(panelIndex, mainDelta, panels) {
    let minsize;
    let maxsize;
    const panel = panels[panelIndex];
    const nextPanel = panels[panelIndex + 1];

    // track the progressive mainDelta so we can report back how much this panel
    // actually moved after all the adjustments have been made
    let resultDelta = mainDelta;

    // make the changes and deal with the consequences later
    panel.size += mainDelta;
    nextPanel.size -= mainDelta;

    // Min and max for LEFT panel
    minsize = this.getPanelMinSize(panelIndex, panels);
    maxsize = this.getPanelMaxSize(panelIndex, panels);

    // if we made the left panel too small
    if (panel.size < minsize) {
      const delta = minsize - panel.size;

      if (panelIndex === 0) resultDelta = this.resizePanel(panelIndex, delta, panels);
      else resultDelta = this.resizePanel(panelIndex - 1, -delta, panels);
    }

    // if we made the left panel too big
    if (maxsize !== 0 && panel.size > maxsize) {
      const delta = panel.size - maxsize;

      if (panelIndex === 0) resultDelta = this.resizePanel(panelIndex, -delta, panels);
      else resultDelta = this.resizePanel(panelIndex - 1, delta, panels);
    }

    // Min and max for RIGHT panel
    minsize = this.getPanelMinSize(panelIndex + 1, panels);
    maxsize = this.getPanelMaxSize(panelIndex + 1, panels);

    // if we made the right panel too small
    if (nextPanel.size < minsize) {
      const delta = minsize - nextPanel.size;

      if (panelIndex + 1 === panels.length - 1)
        resultDelta = this.resizePanel(panelIndex, -delta, panels);
      else resultDelta = this.resizePanel(panelIndex + 1, delta, panels);
    }

    // if we made the right panel too big
    if (maxsize !== 0 && nextPanel.size > maxsize) {
      const delta = nextPanel.size - maxsize;

      if (panelIndex + 1 === panels.length - 1)
        resultDelta = this.resizePanel(panelIndex, delta, panels);
      else resultDelta = this.resizePanel(panelIndex + 1, -delta, panels);
    }

    // Iterate through left panel's snap positions
    for (let i = 0; i < panel.snap.length; i += 1) {
      if (Math.abs(panel.snap[i] - panel.size) < 20) {
        const delta = panel.snap[i] - panel.size;

        if (
          delta !== 0 &&
          panel.size + delta >= this.getPanelMinSize(panelIndex, panels) &&
          nextPanel.size - delta >= this.getPanelMinSize(panelIndex + 1, panels)
        )
          resultDelta = this.resizePanel(panelIndex, delta, panels);
      }
    }

    // Iterate through right panel's snap positions
    for (let i = 0; i < nextPanel.snap.length; i += 1) {
      if (Math.abs(nextPanel.snap[i] - nextPanel.size) < 20) {
        const delta = nextPanel.snap[i] - nextPanel.size;

        if (
          delta !== 0 &&
          panel.size + delta >= this.getPanelMinSize(panelIndex, panels) &&
          nextPanel.size - delta >= this.getPanelMinSize(panelIndex + 1, panels)
        )
          resultDelta = this.resizePanel(panelIndex, -delta, panels);
      }
    }

    // return how much this panel actually resized
    return resultDelta;
  }

  render() {
    const style = {
      container: {
        width: '100%',
        height: '100%',
        [`min${this.getSizeDirection(true)}`]: this.getPanelGroupMinSize(this.props.spacing),
        display: 'flex',
        flexDirection: this.props.direction,
        flexGrow: 1,
      },
      panel: {
        flexGrow: 0,
        display: 'flex',
      },
    };

    // lets build up a new children array with added resize borders
    const initialChildren = React.Children.toArray(this.props.children);
    const newChildren = [];
    let stretchIncluded = false;

    for (let i = 0; i < initialChildren.length; i += 1) {
      // setting up the style for this panel.  Should probably be handled
      // in the child component, but this was easier for now
      const panelStyle = {
        [this.getSizeDirection()]: this.state.panels[i].size,
        [this.props.direction === 'row' ? 'height' : 'width']: '100%',
        [`min${this.getSizeDirection(true)}`]:
          this.state.panels[i].resize === 'stretch' ? 0 : this.state.panels[i].size,

        flexGrow: this.state.panels[i].resize === 'stretch' ? 1 : 0,
        flexShrink: this.state.panels[i].resize === 'stretch' ? 1 : 0,
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
      };

      // patch in the background color if it was supplied as a prop
      Object.assign(panelStyle, { backgroundColor: this.props.panelColor });

      // give position info to children
      const metadata = {
        isFirst: i === 0,
        isLast: i === initialChildren.length - 1,
        resize: this.state.panels[i].resize,

        // window resize handler if this panel is stretchy
        onWindowResize:
          this.state.panels[i].resize === 'stretch'
            ? (...rest) => this.setPanelSize(...rest)
            : null,
      };

      // if none of the panels included was stretchy, make the last one stretchy
      if (this.state.panels[i].resize === 'stretch') stretchIncluded = true;
      if (!stretchIncluded && metadata.isLast) metadata.resize = 'stretch';

      // push children with added metadata
      newChildren.push(
        <Panel
          style={panelStyle}
          key={`panel${i}`}
          panelID={i}
          {...metadata}
          resizing={this.state.resizing}
        >
          {initialChildren[i]}
        </Panel>
      );

      // add a handle between panels
      if (i < initialChildren.length - 1) {
        newChildren.push(
          <Divider
            borderColor={this.props.borderColor}
            key={`divider${i}`}
            panelID={i}
            handleResize={(...rest) => this.handleResize(...rest)}
            enableResize={() => this.enableResize()}
            disableResize={() => this.disableResize()}
            dividerWidth={this.props.spacing}
            direction={this.props.direction}
            showHandles={this.props.showHandles}
          />
        );
      }
    }

    return (
      <div className="panelGroup" style={style.container}>
        {newChildren}
      </div>
    );
  }
}

class Panel extends Component {
  // Find the resizeObject if it has one
  componentDidMount() {
    if (this.props.resize === 'stretch') {
      this.resizeObject.addEventListener('load', () => this.onResizeObjectLoad());
      this.resizeObject.data = 'about:blank';
      this.calculateStretchWidth();
    }
  }

  // Attach resize event listener to resizeObject
  onResizeObjectLoad() {
    this.resizeObject.contentDocument.defaultView.addEventListener('resize', () =>
      this.calculateStretchWidth()
    );
  }

  // Utility function to wait for next render before executing a function
  onNextFrame(callback) {
    setTimeout(() => {
      window.requestAnimationFrame(callback);
    }, 0);
  }

  // Recalculate the stretchy panel if it's container has been resized
  calculateStretchWidth() {
    const { onWindowResize, panelID } = this.props;

    if (onWindowResize !== null) {
      const rect = this.rootElement.getBoundingClientRect();

      onWindowResize(
        panelID,
        { x: rect.width, y: rect.height }

        // recalcalculate again if the width is below minimum
        // Kinda hacky, but for large resizes like fullscreen/Restore
        // it can't solve it in one pass.
        // () => {
        //   this.onNextFrame(() => this.calculateStretchWidth());
        // }
      );
    }
  }

  // Render component
  render() {
    const { resizing } = this.props;
    const style = {
      resizeObject: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0,
      },
    };

    // only attach resize object if panel is stretchy.  Others dont need it
    const resizeObject =
      this.props.resize === 'stretch' ? (
        <object
          style={{ ...style.resizeObject, ...{ zIndex: -1 } }}
          ref={element => {
            this.resizeObject = element;
          }}
          type="text/html"
          aria-label={'resizeObject'}
        />
      ) : null;

    const resizeBlocker = resizing ? (
      <div style={{ ...style.resizeObject, ...{ zIndex: 1 } }} />
    ) : null;

    return (
      <div
        className="panelWrapper"
        style={this.props.style}
        ref={element => {
          this.rootElement = element;
        }}
      >
        {resizeObject}
        {resizeBlocker}
        {this.props.children}
      </div>
    );
  }
}

const DividerRoot = glamorous.div(
  {
    flexGrow: 0,
    position: 'relative',
  },
  ({ borderColor }) => ({
    backgroundColor: borderColor,
  }),
  ({ direction, dividerWidth }) =>
    direction === 'row'
      ? {
          width: dividerWidth,
          minWidth: dividerWidth,
          maxWidth: dividerWidth,
          height: 'auto',
          minHeight: 'auto',
          maxHeight: 'auto',
        }
      : {
          width: 'auto',
          minWidth: 'auto',
          maxWidth: 'auto',
          height: dividerWidth,
          minHeight: dividerWidth,
          maxHeight: dividerWidth,
        }
);

const DividerHandle = glamorous.div(
  {
    position: 'absolute',
    zIndex: 2,
  },
  ({ showHandles }) => ({
    backgroundColor: showHandles ? 'rgba(0,128,255,0)' : 'transparent',
    transition: 'background-color .22s linear',
    '&:hover': {
      backgroundColor: showHandles ? 'rgba(0,128,255,0.25)' : 'transparent',
    },
  }),
  ({ direction, dividerWidth, handleBleed }) => {
    const size = dividerWidth + handleBleed * 2;
    const position = dividerWidth / 2 - size / 2;
    return direction === 'row'
      ? {
          width: size,
          height: '100%',
          left: position,
          top: 0,
          cursor: 'col-resize',
          '&:before': {
            position: 'absolute',
            content: ' ',
            boxSizing: 'border-box',
            top: '50%',
            left: size / 2 - 4 / 2,

            marginTop: -20,
            width: 4,
            height: 25,
            borderLeft: '1px solid rgba(0,0,0,0.15)',
            borderRight: '1px solid rgba(0,0,0,0.15)',
          },
        }
      : {
          width: '100%',
          height: size,
          left: 0,
          top: position,
          cursor: 'row-resize',
          '&:before': {
            position: 'absolute',
            content: ' ',
            boxSizing: 'border-box',
            top: size / 2 - 4 / 2,
            left: '50%',

            marginLeft: -20,
            width: 25,
            height: 4,
            borderTop: '1px solid rgba(0,0,0,0.15)',
            borderBottom: '1px solid rgba(0,0,0,0.15)',
          },
        };
  }
);

class Divider extends Component {
  static defaultProps = {
    dividerWidth: 1,
    handleBleed: 4,
  };

  constructor(props) {
    super(props);
    this.state = {
      dragging: false,
      initPos: { x: null, y: null },
    };
  }

  // Add/remove event listeners based on drag state
  componentDidUpdate(props, state) {
    if (this.state.dragging && !state.dragging) {
      document.addEventListener('mousemove', (...rest) => this.onMouseMove(...rest));
      document.addEventListener('mouseup', (...rest) => this.onMouseUp(...rest));
    } else if (!this.state.dragging && state.dragging) {
      document.removeEventListener('mousemove', (...rest) => this.onMouseMove(...rest));
      document.removeEventListener('mouseup', (...rest) => this.onMouseUp(...rest));
    }
  }

  // Start drag state and set initial position
  onMouseDown(e) {
    // only left mouse button
    if (e.button !== 0) return;

    this.setState({
      dragging: true,
      initPos: {
        x: e.pageX,
        y: e.pageY,
      },
    });

    e.stopPropagation();
    e.preventDefault();

    this.props.enableResize();
  }

  // End drag state
  onMouseUp(e) {
    this.setState({ dragging: false });
    e.stopPropagation();
    e.preventDefault();

    this.props.disableResize();
  }

  // Call resize handler if we're dragging
  onMouseMove(e) {
    if (!this.state.dragging) return;

    const initDelta = {
      x: e.pageX - this.state.initPos.x,
      y: e.pageY - this.state.initPos.y,
    };

    const flowMask = {
      x: this.props.direction === 'row' ? 1 : 0,
      y: this.props.direction === 'column' ? 1 : 0,
    };

    const flowDelta = initDelta.x * flowMask.x + initDelta.y * flowMask.y;

    // Resize the panels
    const resultDelta = this.handleResize(this.props.panelID, initDelta);

    // if the divider moved, reset the initPos
    if (resultDelta + flowDelta !== 0) {
      // Did we move the expected amount? (snapping will result in a larger delta)
      const expectedDelta = resultDelta === flowDelta;

      this.setState({
        initPos: {
          // if we moved more than expected, add the difference to the Position
          x: e.pageX + (expectedDelta ? 0 : resultDelta * flowMask.x),
          y: e.pageY + (expectedDelta ? 0 : resultDelta * flowMask.y),
        },
      });
    }

    e.stopPropagation();
    e.preventDefault();
  }

  // Utility functions for handle size provided how much bleed
  // we want outside of the actual divider div
  getHandleWidth() {
    return this.props.dividerWidth + this.props.handleBleed * 2;
  }
  getHandleOffset() {
    return this.props.dividerWidth / 2 - this.getHandleWidth() / 2;
  }

  // Handle resizing
  handleResize(i, delta) {
    return this.props.handleResize(i, delta);
  }

  // Render component
  render() {
    const { direction, dividerWidth, showHandles, borderColor, handleBleed } = this.props;
    const style = {
      divider: {
        width: direction === 'row' ? dividerWidth : 'auto',
        minWidth: direction === 'row' ? dividerWidth : 'auto',
        maxWidth: direction === 'row' ? dividerWidth : 'auto',
        height: direction === 'column' ? dividerWidth : 'auto',
        minHeight: direction === 'column' ? dividerWidth : 'auto',
        maxHeight: direction === 'column' ? dividerWidth : 'auto',
        flexGrow: 0,
        position: 'relative',
      },
    };
    Object.assign(style.divider, { backgroundColor: borderColor });

    return (
      <DividerRoot
        {...{
          direction,
          showHandles,
          dividerWidth,
          handleBleed,
          borderColor,
        }}
        className="divider"
        onMouseDown={(...rest) => this.onMouseDown(...rest)}
      >
        <DividerHandle
          {...{
            direction,
            showHandles,
            dividerWidth,
            handleBleed,
            borderColor,
          }}
        />
      </DividerRoot>
    );
  }
}

export default PanelGroup;

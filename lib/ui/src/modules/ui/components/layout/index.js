/* eslint-disable react/no-multi-comp */

import { localStorage, window } from 'global';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SplitPane from 'react-split-pane';
// import { SortablePane, Pane } from 'react-sortable-pane';
import PanelGroup from '@storybook/components/dist/layout/split';

import USplit from './usplit';
import Dimensions from './dimensions';

const layoutConfig = {
  direction: 'row',
  items: [
    {
      size: 300,
      resize: 'dynamic',
      component: 'explorer',
    },
    {
      size: 300,
      resize: 'stretch',
      component: 'preview',
    },
    {
      size: 300,
      resize: 'dynamic',
      component: 'addonTabs',
    },
  ],
};

const rootStyle = {
  height: '100vh',
  backgroundColor: '#F7F7F7',
};

const storiesPanelStyle = storiesPanelOnTop => ({
  width: '100%',
  display: 'flex',
  flexDirection: storiesPanelOnTop ? 'column' : 'row',
  alignItems: 'stretch',
  paddingRight: storiesPanelOnTop ? 10 : 0,
});

const addonPanelStyle = addonPanelInRight => ({
  display: 'flex',
  flexDirection: addonPanelInRight ? 'row' : 'column',
  alignItems: 'stretch',
  position: 'absolute',
  width: '100%',
  height: '100%',
  padding: addonPanelInRight ? '5px 10px 10px 0' : '0px 10px 10px 0',
  boxSizing: 'border-box',
});

const resizerCursor = isVert => (isVert ? 'col-resize' : 'row-resize');

const storiesResizerStyle = (showStoriesPanel, storiesPanelOnTop) => ({
  cursor: showStoriesPanel ? resizerCursor(!storiesPanelOnTop) : undefined,
  height: storiesPanelOnTop ? 10 : 'auto',
  width: storiesPanelOnTop ? '100%' : 10,
  zIndex: 1,
});

const addonResizerStyle = (showAddonPanel, addonPanelInRight) => ({
  cursor: showAddonPanel ? resizerCursor(addonPanelInRight) : undefined,
  height: addonPanelInRight ? '100%' : 10,
  width: addonPanelInRight ? 10 : '100%',
  zIndex: 1,
});

const contentPanelStyle = (addonPanelInRight, storiesPanelOnTop) => ({
  position: 'absolute',
  boxSizing: 'border-box',
  width: '100%',
  height: '100%',
  padding: addonPanelInRight ? '10px 2px 10px 0' : '10px 10px 2px 0',
  paddingTop: storiesPanelOnTop ? 0 : 10,
});

const normalPreviewStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: '#FFF',
  border: '1px solid #ECECEC',
  borderRadius: 4,
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
  overflow: 'auto',
  webkitOverflowScrolling: 'touch',
};

const overlayStyle = isDragging => ({
  display: isDragging ? 'block' : 'none',
  position: 'absolute',
  top: '0px',
  right: '0px',
  bottom: '0px',
  left: '0px',
});

const defaultSizes = {
  addonPanel: {
    down: 200,
    right: 400,
  },
  storiesPanel: {
    left: 250,
    top: 400,
  },
};

const saveSizes = sizes => {
  try {
    localStorage.setItem('panelSizes', JSON.stringify(sizes));
    return true;
  } catch (e) {
    return false;
  }
};

const getSavedSizes = sizes => {
  try {
    const panelSizes = localStorage.getItem('panelSizes');
    if (panelSizes) {
      return JSON.parse(panelSizes);
    }
    saveSizes(sizes);
    return sizes;
  } catch (e) {
    saveSizes(sizes);
    return sizes;
  }
};

const conditionalRender = (condition, positive, negative) => (condition ? positive() : negative());

const Panels = ({ direction, items, components }) => (
  <PanelGroup
    direction={direction}
    borderColor="grey"
    panelWidths={items.map(({ size }) => ({ size }))}
  >
    {items.map(({ component }) => components[component]())}
  </PanelGroup>
);

class NewLayout extends Component {
  constructor(props) {
    super(props);

    this.layout = layoutConfig;
    this.components = {
      explorer: () => props.storiesPanel(),
      preview: () => props.preview(),
      addonTabs: () => props.addonPanel(),
    };
  }
  render() {
    const { direction, items } = this.layout;
    const { components } = this;
    return (
      <div style={rootStyle}>
        <Panels {...{ direction, items, components }} />
      </div>
    );
  }
}

class OldLayout extends Component {
  constructor(props) {
    super(props);

    this.layerSizes = getSavedSizes(defaultSizes);

    this.state = {
      previewPanelDimensions: {
        height: 0,
        width: 0,
      },
      isDragging: false,
    };

    this.onResize = this.onResize.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onDragStart() {
    this.setState({ isDragging: true });
  }

  onDragEnd() {
    this.setState({ isDragging: false });
  }

  onResize(pane, mode) {
    return size => {
      this.layerSizes[pane][mode] = size;
      saveSizes(this.layerSizes);

      const { clientWidth, clientHeight } = this.previewPanelRef;

      this.setState({
        previewPanelDimensions: {
          width: clientWidth,
          height: clientHeight,
        },
      });
    };
  }

  render() {
    const {
      goFullScreen,
      showStoriesPanel,
      showAddonPanel,
      addonPanelInRight,
      addonPanel,
      storiesPanel,
      preview,
    } = this.props;
    const { previewPanelDimensions } = this.state;

    const storiesPanelOnTop = false;

    let previewStyle = normalPreviewStyle;

    if (goFullScreen) {
      previewStyle = fullScreenPreviewStyle;
    }

    const sizes = getSavedSizes(this.layerSizes);

    const storiesPanelDefaultSize = !storiesPanelOnTop
      ? sizes.storiesPanel.left
      : sizes.storiesPanel.top;
    const addonPanelDefaultSize = !addonPanelInRight
      ? sizes.addonPanel.down
      : sizes.addonPanel.right;

    const addonSplit = addonPanelInRight ? 'vertical' : 'horizontal';
    const storiesSplit = storiesPanelOnTop ? 'horizontal' : 'vertical';

    return (
      <div style={rootStyle}>
        <SplitPane
          split={storiesSplit}
          allowResize={showStoriesPanel}
          minSize={150}
          maxSize={-400}
          size={showStoriesPanel ? storiesPanelDefaultSize : 1}
          defaultSize={storiesPanelDefaultSize}
          resizerStyle={storiesResizerStyle(showStoriesPanel, storiesPanelOnTop)}
          onDragStarted={this.onDragStart}
          onDragFinished={this.onDragEnd}
          onChange={this.onResize('storiesPanel', storiesPanelOnTop ? 'top' : 'left')}
        >
          {conditionalRender(
            showStoriesPanel,
            () => (
              <div style={storiesPanelStyle(storiesPanelOnTop)}>
                <div style={{ flexGrow: 1, height: '100%', width: '100%' }}>{storiesPanel()}</div>
                <USplit shift={5} split={storiesSplit} />
              </div>
            ),
            () => <span />
          )}

          <SplitPane
            split={addonSplit}
            allowResize={showAddonPanel}
            primary="second"
            minSize={addonPanelInRight ? 200 : 100}
            maxSize={-200}
            size={showAddonPanel ? addonPanelDefaultSize : 1}
            defaultSize={addonPanelDefaultSize}
            resizerStyle={addonResizerStyle(showAddonPanel, addonPanelInRight)}
            onDragStarted={this.onDragStart}
            onDragFinished={this.onDragEnd}
            onChange={this.onResize('addonPanel', addonPanelInRight ? 'right' : 'down')}
          >
            <div style={contentPanelStyle(addonPanelInRight, storiesPanelOnTop)}>
              {/*
                When resizing panels, the drag event breaks if the cursor
                moves over the iframe. Show an overlay div over iframe
                at drag start and hide it when the drag ends.
              */}
              <div style={overlayStyle(this.state.isDragging)} />
              <div
                style={previewStyle}
                ref={ref => {
                  this.previewPanelRef = ref;
                }}
              >
                {preview()}
              </div>
              <Dimensions {...previewPanelDimensions} />
            </div>
            {conditionalRender(
              showAddonPanel,
              () => (
                <div style={addonPanelStyle(addonPanelInRight)}>
                  <USplit shift={-5} split={addonSplit} />
                  {addonPanel()}
                </div>
              ),
              () => <span />
            )}
          </SplitPane>
        </SplitPane>
      </div>
    );
  }
}

OldLayout.propTypes = {
  showStoriesPanel: PropTypes.bool.isRequired,
  showAddonPanel: PropTypes.bool.isRequired,
  goFullScreen: PropTypes.bool.isRequired,
  storiesPanel: PropTypes.func.isRequired,
  preview: PropTypes.func.isRequired,
  addonPanel: PropTypes.func.isRequired,
  addonPanelInRight: PropTypes.bool.isRequired,
};

export default NewLayout;

/* WORKLOG - norbert
 *
 * goals:
 * [ ] a config that describes the layout 
 * [ ] implement config => render 
 * 
 * stretch goals
 * [ ] get global config from config.js
 * [ ] allow local config from story
 * [ ] allow modifying config at runtime
 * 
 * long stretch goals
 * [ ] persist changes
 * [ ] setting on where to persist (localstorage / config)
 * 
 * ideapad:
 * 
 * 
 * 
*/

// NESTED SPLITS
// const splitlayout = {
//   direction: 'vertical',
//   item: [
//     {
//       size: 1,
//       component: 'preview',
//     },
//     {
//       size: '300px',
//       component: 'addonTabs',
//     },
//   ],
// };

// GRID (suitable for configuring multiple previews)
// const gridlayout = [
//   { i: 'a', x: 0, y: 0, w: 1, h: 2, static: true },
//   { i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
//   { i: 'c', x: 4, y: 0, w: 1, h: 2 },
// ];
// return (
//   <ReactGridLayout className="layout" layout={gridlayout} cols={12} rowHeight={30} width={1200}>
//     <div key="a">a</div>
//     <div key="b">b</div>
//     <div key="c">c</div>
//   </ReactGridLayout>
// );

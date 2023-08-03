import type { ReactNode } from 'react';
import type { State } from '@storybook/manager-api';
import type { Theme } from '@storybook/theming';
import React, { Component, Fragment } from 'react';
import { styled, withTheme } from '@storybook/theming';
import type { Bounds, Coordinates, PanelPosition } from './types';
import * as persistence from './persist';
import {
  DEFAULT_NAV_WIDTH,
  DEFAULT_PANEL_WIDTH,
  MIN_CANVAS_HEIGHT,
  MIN_CANVAS_WIDTH,
  MIN_NAV_WIDTH,
  MIN_PANEL_HEIGHT,
  MIN_PANEL_WIDTH,
} from './constants';
import type { DraggableData, DraggableEvent } from './draggers';
import { Draggable, Handle } from './draggers';
import { getMainPosition, getPanelPosition, getPreviewPosition } from './helpers';

export interface BasePanelRenderProps {
  viewMode?: State['viewMode'];
  animate: boolean;
  isFullscreen?: boolean;
  position: Bounds;
}

export interface LayoutRenderProps {
  mainProps: BasePanelRenderProps;
  previewProps: BasePanelRenderProps & {
    showToolbar: boolean;
  };
  navProps: BasePanelRenderProps & {
    hidden: boolean;
  };
  panelProps: BasePanelRenderProps & {
    align: PanelPosition;
    hidden: boolean;
  };
}

export interface LayoutProps {
  children: (data: LayoutRenderProps) => ReactNode;
  panelCount: number;
  bounds: {
    width: number;
    height: number;
    top: number;
    left: number;
  };
  options: {
    isFullscreen: boolean;
    showNav: boolean;
    showPanel: boolean;
    panelPosition: 'bottom' | 'right';
    showToolbar: boolean;
  };
  viewMode: State['viewMode'];
  theme: Theme;
}

export interface LayoutState {
  isDragging: 'nav' | 'panel' | false;
  resizerNav: Coordinates;
  resizerPanel: Coordinates;
}

const HoverBlocker = styled.div({
  position: 'absolute',
  left: 0,
  top: 0,
  zIndex: 15,
  height: '100vh',
  width: '100vw',
});

class Wrapper extends Component<LayoutProps, LayoutState> {
  static defaultProps: Partial<LayoutProps> = {
    viewMode: undefined,
  };

  navRef: React.RefObject<HTMLDivElement>;

  panelRef: React.RefObject<HTMLDivElement>;

  constructor(props: LayoutProps) {
    super(props);
    this.navRef = React.createRef();
    this.panelRef = React.createRef();
    const { bounds, options } = props;

    const { resizerNav, resizerPanel } = persistence.get();

    this.state = {
      isDragging: false,
      resizerNav: resizerNav || { x: DEFAULT_NAV_WIDTH, y: 0 },
      resizerPanel:
        resizerPanel ||
        (options.panelPosition === 'bottom'
          ? { x: 0, y: Math.round(bounds.height * 0.6) }
          : { x: bounds.width - DEFAULT_PANEL_WIDTH, y: 0 }),
    };
  }

  static getDerivedStateFromProps(props: Readonly<LayoutProps>, state: LayoutState): LayoutState {
    const { bounds, options } = props;
    const { resizerPanel, resizerNav } = state;

    const isNavHidden = options.isFullscreen || !options.showNav;
    const isPanelHidden = options.isFullscreen || !options.showPanel;

    const { panelPosition } = options;
    const isPanelRight = panelPosition === 'right';
    const isPanelBottom = panelPosition === 'bottom';

    const navX = resizerNav.x;
    const panelX = resizerPanel.x;
    const panelY = resizerPanel.y;

    const mutation = {} as LayoutState;

    if (!isNavHidden) {
      const minPanelWidth = !isPanelHidden && isPanelRight ? MIN_PANEL_WIDTH : 0;
      const minMainWidth = MIN_CANVAS_WIDTH + minPanelWidth;
      const maxNavX = bounds.width - minMainWidth;
      const minNavX = MIN_NAV_WIDTH; // coordinate translates directly to width here
      if (navX > maxNavX) {
        // upper bound
        mutation.resizerNav = {
          x: maxNavX,
          y: 0,
        };
      } else if (navX < minNavX || maxNavX < minNavX) {
        // lower bound, supercedes upper bound if needed
        mutation.resizerNav = {
          x: minNavX,
          y: 0,
        };
      }
    }

    if (isPanelRight && !isPanelHidden) {
      const maxPanelX = bounds.width - MIN_PANEL_WIDTH;
      const minPanelX = navX + MIN_CANVAS_WIDTH;
      if (panelX > maxPanelX || panelX === 0) {
        // upper bound or when switching orientation
        mutation.resizerPanel = {
          x: maxPanelX,
          y: 0,
        };
      } else if (panelX < minPanelX) {
        // lower bound
        mutation.resizerPanel = {
          x: minPanelX,
          y: 0,
        };
      }
    }

    if (isPanelBottom && !isPanelHidden) {
      const maxPanelY = bounds.height - MIN_PANEL_HEIGHT;
      if (panelY > maxPanelY || panelY === 0) {
        // lower bound or when switching orientation
        mutation.resizerPanel = {
          x: 0,
          y: bounds.height - 200,
        };
      }
      // upper bound is enforced by the Draggable's bounds
    }

    return mutation.resizerPanel || mutation.resizerNav ? { ...state, ...mutation } : state;
  }

  componentDidUpdate(prevProps: LayoutProps, prevState: LayoutState) {
    const { resizerPanel, resizerNav } = this.state;

    persistence.set({
      resizerPanel,
      resizerNav,
    });
    const { width: prevWidth, height: prevHeight } = prevProps.bounds;
    const { bounds, options } = this.props;
    const { width, height } = bounds;
    if (width !== prevWidth || height !== prevHeight) {
      const { panelPosition } = options;
      const isPanelBottom = panelPosition === 'bottom';
      if (isPanelBottom) {
        this.setState({
          resizerPanel: {
            x: prevState.resizerPanel.x,
            y: prevState.resizerPanel.y - (prevHeight - height),
          },
        });
      } else {
        this.setState({
          resizerPanel: {
            x: prevState.resizerPanel.x - (prevWidth - width),
            y: prevState.resizerPanel.y,
          },
        });
      }
    }
  }

  resizeNav = (e: DraggableEvent, data: DraggableData) => {
    if (data.deltaX) {
      this.setState({ resizerNav: { x: data.x, y: data.y } });
    }
  };

  resizePanel = (e: DraggableEvent, data: DraggableData) => {
    const { options } = this.props;

    if (
      (data.deltaY && options.panelPosition === 'bottom') ||
      (data.deltaX && options.panelPosition === 'right')
    ) {
      this.setState({ resizerPanel: { x: data.x, y: data.y } });
    }
  };

  setDragNav = () => {
    this.setState({ isDragging: 'nav' });
  };

  setDragPanel = () => {
    this.setState({ isDragging: 'panel' });
  };

  unsetDrag = () => {
    this.setState({ isDragging: false });
  };

  render() {
    const { children, bounds, options, viewMode, panelCount } = this.props;
    const { isDragging, resizerNav, resizerPanel } = this.state;

    const margin = 0;
    const isNavHidden = options.isFullscreen || !options.showNav;
    const isPanelHidden =
      options.isFullscreen || !options.showPanel || viewMode !== 'story' || panelCount === 0;
    const isFullscreen = options.isFullscreen || (isNavHidden && isPanelHidden);
    const { showToolbar } = options;

    const { panelPosition } = options;
    const isPanelBottom = panelPosition === 'bottom';
    const isPanelRight = panelPosition === 'right';

    const panelX = resizerPanel.x;
    const navX = resizerNav.x;

    return bounds ? (
      <Fragment>
        {isNavHidden ? null : (
          <Draggable
            axis="x"
            position={resizerNav}
            bounds={{
              left: MIN_NAV_WIDTH,
              top: 0,
              right:
                isPanelRight && !isPanelHidden
                  ? panelX - MIN_CANVAS_WIDTH
                  : bounds.width - MIN_CANVAS_WIDTH,
              bottom: 0,
            }}
            onStart={this.setDragNav}
            onDrag={this.resizeNav}
            onStop={this.unsetDrag}
            nodeRef={this.navRef}
          >
            <Handle ref={this.navRef} axis="x" isDragging={isDragging === 'nav'} />
          </Draggable>
        )}

        {isPanelHidden ? null : (
          <Draggable
            axis={isPanelBottom ? 'y' : 'x'}
            position={resizerPanel}
            bounds={
              isPanelBottom
                ? {
                    left: 0,
                    top: MIN_CANVAS_HEIGHT,
                    right: 0,
                    bottom: bounds.height - MIN_PANEL_HEIGHT,
                  }
                : {
                    left: isNavHidden ? MIN_CANVAS_WIDTH : navX + MIN_CANVAS_WIDTH,
                    top: 0,
                    right: bounds.width - MIN_PANEL_WIDTH,
                    bottom: 0,
                  }
            }
            onStart={this.setDragPanel}
            onDrag={this.resizePanel}
            onStop={this.unsetDrag}
            nodeRef={this.panelRef}
          >
            <Handle
              ref={this.panelRef}
              isDragging={isDragging === 'panel'}
              style={
                isPanelBottom
                  ? {
                      left: navX + margin,
                      width: bounds.width - navX - 2 * margin,
                      marginTop: -10,
                    }
                  : {
                      marginLeft: -10,
                    }
              }
              axis={isPanelBottom ? 'y' : 'x'}
            />
          </Draggable>
        )}

        {isDragging ? <HoverBlocker /> : null}
        {children({
          mainProps: {
            viewMode,
            animate: !isDragging,
            isFullscreen,
            position: getMainPosition({ bounds, resizerNav, isNavHidden, isFullscreen, margin }),
          },
          previewProps: {
            viewMode,
            animate: !isDragging,
            isFullscreen,
            showToolbar,
            position: getPreviewPosition({
              isFullscreen,
              isNavHidden,
              isPanelHidden,
              resizerNav,
              resizerPanel,
              bounds,
              panelPosition,
              margin,
            }),
          },
          navProps: {
            viewMode,
            animate: !isDragging,
            hidden: isNavHidden,
            position: {
              height: bounds.height,
              left: 0,
              top: 0,
              width: navX + margin,
            },
          },
          panelProps: {
            viewMode,
            animate: !isDragging,
            align: options.panelPosition,
            hidden: isPanelHidden,
            position: getPanelPosition({
              isPanelBottom,
              isPanelHidden,
              isNavHidden,
              bounds,
              resizerPanel,
              resizerNav,
              margin,
            }),
          },
        })}
      </Fragment>
    ) : null;
  }
}

const ThemedLayout = withTheme(Wrapper) as unknown as typeof Wrapper;

export { ThemedLayout as Wrapper };

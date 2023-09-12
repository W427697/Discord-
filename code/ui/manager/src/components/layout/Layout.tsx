import type { Reducer } from 'react';
import React, { useEffect, useReducer, useRef } from 'react';
import { css, styled } from '@storybook/theming';
import { useUpstreamState } from '../../hooks';
import type { Props, LayoutState } from './Layout.types';
import { useDragging } from './Layout.DesktopControls';

const createReducer =
  (persistence: Props['persistence'], setState: Props['setState']) =>
  (state: LayoutState, action: Partial<LayoutState>) => {
    if ('isPanelShown' in action || 'isSidebarShown' in action) {
      // sync changes upstream
      if (
        (action.isPanelShown !== undefined && action.isPanelShown !== state.isPanelShown) ||
        (action.isSidebarShown !== undefined && action.isSidebarShown !== state.isSidebarShown)
      ) {
        const { isPanelShown: draftPanel, isSidebarShown: draftSidebar } = state;
        const { isPanelShown: actionPanel, isSidebarShown: actionSidebar } = action;
        const update = {
          showPanel: actionPanel === undefined ? draftPanel : actionPanel,
          showSidebar: actionSidebar === undefined ? draftSidebar : actionSidebar,
        };
        // this upstream sync should not happen whilst react is already in the render phase
        setTimeout(setState, 16, update);
      }
    }
    console.log(
      'LOG in reducer:',
      state.panelHeight,
      state.panelPosition,
      state.panelWidth,
      state.sidebarWidth
    );

    if (action.isDragging === false) {
      persistence.current.set({
        panelHeight: state.panelHeight,
        panelPosition: state.panelPosition,
        panelWidth: state.panelWidth,
        sidebarWidth: state.sidebarWidth,
      });
    }

    console.log('LOG action:', action);
    return { ...state, ...action };
  };

export const Layout = ({ state: incomingState, persistence, setState, ...slots }: Props) => {
  console.log('LOG :', persistence.current.value);
  const [state, updateState] = useReducer<Reducer<LayoutState, Partial<LayoutState>>>(
    createReducer(persistence, setState),
    {
      isDragging: false,
      isSidebarShown: incomingState.isSidebarShown || false,
      isPanelShown: incomingState.isPanelShown || false,
      viewMode: incomingState.viewMode || 'story',
      panelPosition: incomingState.panelPosition || persistence.current.value.panelPosition,
      sidebarWidth:
        incomingState.isSidebarShown === true ? persistence.current.value.sidebarWidth : 0,
      panelHeight: persistence.current.value.panelHeight,
      panelWidth: persistence.current.value.panelWidth,
    } satisfies LayoutState
  );
  console.log(
    'LOG in Layout:',
    state.panelHeight,
    state.panelPosition,
    state.panelWidth,
    state.sidebarWidth
  );

  useEffect(() => {
    updateState({ viewMode: incomingState.viewMode });
  }, [incomingState.viewMode]);

  // keep a ref to the state so we can get the latest state in the event handlers
  const stateRef = useRef<LayoutState>(state);
  Object.assign(stateRef.current, state, incomingState);

  // respond to state changes upstream
  useUpstreamState(stateRef, updateState, incomingState);

  const { panelResizerRef, sidebarResizerRef } = useDragging(updateState, stateRef);

  const showPages = state.viewMode !== 'story' && state.viewMode !== 'docs';
  const showPanel = state.viewMode === 'story';

  return (
    <>
      <LayoutContainer {...state}>
        {showPages && <PagesContainer>{slots.slotPages}</PagesContainer>}
        <ContentContainer>{slots.slotMain}</ContentContainer>
        <SidebarContainer hidden={state.sidebarWidth === 0}>
          <Drag variant="sidebar" ref={sidebarResizerRef}>
            <Shadow variant="sidebar" />
          </Drag>
          {slots.slotSidebar}
        </SidebarContainer>
        {showPanel && (
          <>
            <PanelContainer>
              <Drag
                variant={state.panelPosition === 'bottom' ? 'panelBottom' : 'panelRight'}
                ref={panelResizerRef}
              >
                <Shadow variant={state.panelPosition === 'bottom' ? 'panel' : 'sidebar'} />
              </Drag>
              {slots.slotPanel}
            </PanelContainer>
          </>
        )}
      </LayoutContainer>
    </>
  );
};

const LayoutContainer = styled.div<LayoutState>(
  ({ sidebarWidth, panelWidth, panelHeight, viewMode, panelPosition }) => {
    return {
      width: '100%',
      height: '100%',
      display: 'grid',
      overflow: 'hidden',
      gap: 0,
      gridTemplateColumns: `${sidebarWidth}% 1fr ${panelWidth}% [right]`,
      gridTemplateRows: `[top] 1fr ${panelHeight}% [bottom]`,
      gridTemplateAreas: (() => {
        if (viewMode === 'docs') {
          // remove panel in docs viewMode
          return `"sidebar content content"
                  "sidebar content content"`;
        }
        if (panelPosition === 'right') {
          return `"sidebar content panel"
                  "sidebar content panel"`;
        }
        return `"sidebar content content content"
                "sidebar panel   panel   panel"`;
      })(),
    };
  }
);

const PanelContainer = styled.div(({ theme }) => ({
  gridArea: 'panel',
  position: 'relative',
  backgroundColor: theme.background.app,
  borderLeft: `1px solid ${theme.color.border}`,
  boxShadow: '0 1px 5px 0 rgba(0, 0, 0, 0.1)',
}));

const SidebarContainer = styled.div(({ theme }) => ({
  backgroundColor: theme.background.app,
  gridArea: 'sidebar',
  position: 'relative',
}));

const ContentContainer = styled.div(({ theme }) => ({
  display: 'grid',
  position: 'relative',
  backgroundColor: theme.background.content,
  borderLeft: `1px solid ${theme.color.border}`,
  gridArea: 'content',
}));

const PagesContainer = styled.div(({ theme }) => ({
  // see named areas and tracks in the grid template area defined in LayoutContainer
  gridArea: 'content-start / content-start / right / bottom',
  zIndex: 1,
}));

const Drag = styled.div<{ variant: 'sidebar' | 'panelBottom' | 'panelRight' }>(
  {
    position: 'absolute',
    opacity: 0,
    transition: 'opacity 0.2s ease-in-out',
    zIndex: 2,

    '&:hover': {
      opacity: 1,
    },
  },
  ({ variant }) => {
    if (variant === 'sidebar')
      return {
        width: '20px',
        height: '100%',
        top: '-10px',
        right: '-10px',

        '&:hover': {
          cursor: 'col-resize',
        },
      };
    if (variant === 'panelRight')
      return {
        width: '20px',
        height: '100%',
        top: '-10px',
        left: '-10px',

        '&:hover': {
          cursor: 'col-resize',
        },
      };
    return {
      width: '100%',
      height: '20px',
      top: '-10px',
      left: '-10px',

      '&:hover': {
        cursor: 'row-resize',
      },
    };
  }
);

const Shadow = styled.div<{ variant: 'sidebar' | 'panel' }>(
  {
    width: '50%',
    height: '100%',
    overflow: 'hidden',

    '&::after': {
      content: '""',
      display: 'block',
      background:
        'radial-gradient(at center center, rgba(0, 0, 0, 0.14) 0%,transparent 50%,transparent 100%)',
    },
  },
  ({ variant }) => {
    if (variant === 'sidebar')
      return {
        width: '50%',
        height: '100%',

        '&::after': {
          width: '200%',
          height: '100%',
        },
      };
    return {
      width: '100%',
      height: '50%',

      '&::after': {
        width: '100%',
        height: '200%',
      },
    };
  }
);

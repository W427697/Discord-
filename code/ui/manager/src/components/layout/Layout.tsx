import type { Reducer } from 'react';
import React, { useEffect, useReducer, useRef } from 'react';
import { styled } from '@storybook/theming';
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

    console.log('LOG reducer:', { state, action });
    if (!action.isDragging) {
      persistence.current.set({
        panelHeight: action.panelHeight ?? state.panelHeight,
        panelPosition: action.panelPosition ?? state.panelPosition,
        panelWidth: action.panelWidth ?? state.panelWidth,
        sidebarWidth: action.sidebarWidth ?? state.sidebarWidth,
      });
    }

    return { ...state, ...action };
  };

export const Layout = ({ state: incomingState, persistence, setState, ...slots }: Props) => {
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

  useEffect(() => {
    updateState({ viewMode: incomingState.viewMode, panelPosition: incomingState.panelPosition });
  }, [incomingState.viewMode, incomingState.panelPosition]);

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
        <SidebarContainer>
          <Drag ref={sidebarResizerRef} />
          {slots.slotSidebar}
        </SidebarContainer>
        {showPanel && (
          <>
            <PanelContainer position={state.panelPosition}>
              <Drag
                orientation={state.panelPosition === 'bottom' ? 'horizontal' : 'vertical'}
                position={state.panelPosition === 'bottom' ? 'left' : 'right'}
                ref={panelResizerRef}
              />
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

const SidebarContainer = styled.div(({ theme }) => ({
  backgroundColor: theme.background.app,
  gridArea: 'sidebar',
  position: 'relative',
  borderRight: `1px solid ${theme.color.border}`,
}));

const ContentContainer = styled.div(({ theme }) => ({
  display: 'grid',
  position: 'relative',
  backgroundColor: theme.background.content,
  gridArea: 'content',
}));

const PagesContainer = styled.div(({ theme }) => ({
  // see named areas and tracks in the grid template area defined in LayoutContainer
  gridArea: 'content-start / content-start / right / bottom',
  backgroundColor: theme.background.content,
  zIndex: 1,
}));

const PanelContainer = styled.div<{ position: LayoutState['panelPosition'] }>(
  ({ theme, position }) => ({
    gridArea: 'panel',
    position: 'relative',
    backgroundColor: theme.background.content,
    borderTop: position === 'bottom' ? `1px solid ${theme.color.border}` : null,
    borderLeft: position === 'right' ? `1px solid ${theme.color.border}` : null,
  })
);

const Drag = styled.div<{ orientation?: 'horizontal' | 'vertical'; position?: 'left' | 'right' }>(
  ({ theme }) => ({
    position: 'absolute',
    opacity: 0,
    transition: 'opacity 0.2s ease-in-out',
    zIndex: 2,

    '&:after': {
      content: '""',
      display: 'block',
      backgroundColor: theme.color.secondary,
    },

    '&:hover': {
      opacity: 1,
    },
  }),
  ({ orientation = 'vertical', position = 'left' }) => {
    if (orientation === 'vertical')
      return {
        width: '20px',
        height: '100%',
        top: 0,
        right: position === 'left' ? '-10px' : null,
        left: position === 'right' ? '-10px' : null,

        '&:after': {
          width: 1,
          height: '100%',
          marginLeft: 10,
        },

        '&:hover': {
          cursor: 'col-resize',
        },
      };
    return {
      width: '100%',
      height: '20px',
      top: '-10px',
      left: 0,

      '&:after': {
        width: '100%',
        height: 1,
        marginTop: 9,
      },

      '&:hover': {
        cursor: 'row-resize',
      },
    };
  }
);

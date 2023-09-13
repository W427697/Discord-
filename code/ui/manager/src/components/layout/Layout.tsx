import React, { useEffect, useLayoutEffect, useState } from 'react';
import { styled } from '@storybook/theming';
import type { Props, LayoutState, ManagerLayoutState } from './Layout.types';
import { useDragging } from './useDragging';

const layoutStateIsEqual = (state: ManagerLayoutState, other: ManagerLayoutState) =>
  state.navSize === other.navSize &&
  state.bottomPanelHeight === other.bottomPanelHeight &&
  state.rightPanelWidth === other.rightPanelWidth &&
  state.panelPosition === other.panelPosition;

/**
 * Manages the internal state of panels while dragging, and syncs it with the
 * layout state in the global manager store when the user is done dragging.
 * Also syncs the layout state from the global manager store to the internal state
 * here when necessary
 */
const useLayoutSyncingState = (
  managerLayoutState: Props['managerLayoutState'],
  setManagerLayoutState: Props['setManagerLayoutState']
) => {
  // ref to keep track of previous managerLayoutState, to check if the props change
  const prevManagerLayoutStateRef = React.useRef<ManagerLayoutState>(managerLayoutState);

  const [internalDraggingSizeState, setInternalDraggingSizeState] = useState<LayoutState>({
    ...managerLayoutState,
    isDragging: false,
  });

  /**
   * Sync FROM managerLayoutState to internalDraggingState if user is not dragging
   */
  useEffect(() => {
    if (
      internalDraggingSizeState.isDragging || // don't interrupt user's drag
      layoutStateIsEqual(managerLayoutState, prevManagerLayoutStateRef.current) // don't set any state if managerLayoutState hasn't changed
    ) {
      return;
    }
    prevManagerLayoutStateRef.current = managerLayoutState;
    setInternalDraggingSizeState((state) => ({ ...state, ...managerLayoutState }));
  }, [internalDraggingSizeState.isDragging, managerLayoutState, setInternalDraggingSizeState]);

  /**
   * Sync size changes TO managerLayoutState when drag is done
   */
  useLayoutEffect(() => {
    if (
      internalDraggingSizeState.isDragging || // wait with syncing managerLayoutState until user is done dragging
      layoutStateIsEqual(prevManagerLayoutStateRef.current, internalDraggingSizeState) // don't sync managerLayoutState if it doesn't differ from internalDraggingSizeState
    ) {
      return;
    }
    const nextState = {
      navSize: internalDraggingSizeState.navSize,
      bottomPanelHeight: internalDraggingSizeState.bottomPanelHeight,
      rightPanelWidth: internalDraggingSizeState.rightPanelWidth,
    };
    prevManagerLayoutStateRef.current = {
      ...prevManagerLayoutStateRef.current,
      ...nextState,
    };
    setManagerLayoutState(nextState);
  }, [internalDraggingSizeState, setManagerLayoutState]);

  const { panelResizerRef, sidebarResizerRef } = useDragging(setInternalDraggingSizeState);
  const { navSize, rightPanelWidth, bottomPanelHeight } = internalDraggingSizeState.isDragging
    ? internalDraggingSizeState
    : managerLayoutState;

  return {
    navSize,
    rightPanelWidth,
    bottomPanelHeight,
    panelResizerRef,
    sidebarResizerRef,
  };
};

export const Layout = ({ managerLayoutState, setManagerLayoutState, ...slots }: Props) => {
  const { navSize, rightPanelWidth, bottomPanelHeight, panelResizerRef, sidebarResizerRef } =
    useLayoutSyncingState(managerLayoutState, setManagerLayoutState);

  const showPages =
    managerLayoutState.viewMode !== 'story' && managerLayoutState.viewMode !== 'docs';
  const showPanel = managerLayoutState.viewMode === 'story';

  return (
    <LayoutContainer
      navSize={navSize}
      rightPanelWidth={rightPanelWidth}
      bottomPanelHeight={bottomPanelHeight}
      panelPosition={managerLayoutState.panelPosition}
      viewMode={managerLayoutState.viewMode}
    >
      {showPages && <PagesContainer>{slots.slotPages}</PagesContainer>}
      <ContentContainer>{slots.slotMain}</ContentContainer>
      <SidebarContainer>
        <Drag variant="sidebar" ref={sidebarResizerRef}>
          <Shadow variant="sidebar" />
        </Drag>
        {slots.slotSidebar}
      </SidebarContainer>
      {showPanel && (
        <>
          <PanelContainer>
            <Drag
              variant={managerLayoutState.panelPosition === 'bottom' ? 'panelBottom' : 'panelRight'}
              ref={panelResizerRef}
            >
              <Shadow
                variant={managerLayoutState.panelPosition === 'bottom' ? 'panel' : 'sidebar'}
              />
            </Drag>
            {slots.slotPanel}
          </PanelContainer>
        </>
      )}
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div<ManagerLayoutState>(
  ({ navSize, rightPanelWidth, bottomPanelHeight, viewMode, panelPosition }) => {
    return {
      width: '100%',
      height: '100%',
      display: 'grid',
      overflow: 'hidden',
      gap: 0,
      gridTemplateColumns: `${navSize}% 1fr ${rightPanelWidth}% [right]`,
      gridTemplateRows: `[top] 1fr ${bottomPanelHeight}% [bottom]`,
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

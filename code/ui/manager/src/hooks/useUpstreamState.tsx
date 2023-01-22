import type { Dispatch, MutableRefObject } from 'react';
import React from 'react';
import type { ExposedLayoutState, LayoutState } from '../components/layout/Layout.types';

const useUpstreamState = (
  stateRef: MutableRefObject<LayoutState>,
  updateState: Dispatch<Partial<LayoutState>>,
  incomingState: ExposedLayoutState
) => {
  const { isPanelShown: showPanel, panelPosition, isSidebarShown: showSidebar } = incomingState;
  React.useEffect(() => {
    const { panelHeight, sidebarWidth, panelWidth } = stateRef.current;
    if (showPanel && panelPosition === 'bottom' && panelHeight === 0) {
      // TODO: take from some preference
      updateState({
        panelHeight: 20,
        isPanelShown: showPanel,
        panelPosition,
        isSidebarShown: showSidebar,
      });
      return;
    }
    if (showPanel && panelPosition === 'right' && panelWidth === 0) {
      // TODO: take from some preference
      updateState({
        panelWidth: 20,
        isPanelShown: showPanel,
        panelPosition,
        isSidebarShown: showSidebar,
      });
      return;
    }
    if (!showPanel) {
      updateState({
        panelHeight: 0,
        panelWidth: 0,
        isPanelShown: showPanel,
        panelPosition,
        isSidebarShown: showSidebar,
      });
      return;
    }
    if (showSidebar && sidebarWidth === 0) {
      // TODO: take from some preference
      updateState({
        sidebarWidth: 20,
        isPanelShown: showPanel,
        panelPosition,
        isSidebarShown: showSidebar,
      });
      return;
    }
    if (!showSidebar && sidebarWidth !== 0) {
      updateState({
        sidebarWidth: 0,
        isPanelShown: showPanel,
        panelPosition,
        isSidebarShown: showSidebar,
      });
    }
  }, [updateState, showPanel, panelPosition, showSidebar, stateRef]);
};

export default useUpstreamState;

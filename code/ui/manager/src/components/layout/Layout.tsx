import { useImmerReducer } from 'use-immer';
import type { Dispatch, MutableRefObject } from 'react';
import React, { useEffect, useRef } from 'react';
import { styled } from '@storybook/theming';
import { DESKTOP, getGridTemplate, MOBILE, SHARED } from './Layout.styles';
import type { Props, LayoutState, ExposedLayoutState } from './Layout.types';
import { MobileControls } from './Layout.MobileControls';
import { DesktopControls } from './Layout.DesktopControls';

export const Layout = ({ state: incomingState, persistence, setState, ...slots }: Props) => {
  const [state, updateState] = useImmerReducer<LayoutState, Partial<LayoutState>>(
    (draft, action) => {
      if ('showPanel' in action || 'showSidebar' in action) {
        // sync changes upstream
        if (
          (action.showPanel !== undefined && action.showPanel !== draft.showPanel) ||
          (action.showSidebar !== undefined && action.showSidebar !== draft.showSidebar)
        ) {
          const { showPanel: draftPanel, showSidebar: draftSidebar } = draft;
          const { showPanel: actionPanel, showSidebar: actionSidebar } = action;
          const update = {
            showPanel: actionPanel === undefined ? draftPanel : actionPanel,
            showSidebar: actionSidebar === undefined ? draftSidebar : actionSidebar,
          };
          // this upstream sync should not happen whilst react is already in the render phase
          setTimeout(setState, 16, update);
        }
      }

      if (action.isDragging === false) {
        persistence.current.set({
          panelHeight: draft.panelHeight,
          panelPosition: draft.panelPosition,
          panelWidth: draft.panelWidth,
          sidebarWidth: draft.sidebarWidth,
        });
      }

      Object.assign(draft, action);
    },
    {
      isDragging: false,
      showSidebar: incomingState.showSidebar || false,
      showPanel: incomingState.showPanel || false,
      viewMode: incomingState.viewMode || 'story',
      panelPosition: incomingState.panelPosition || persistence.current.value.panelPosition,
      sidebarWidth: incomingState.showSidebar === true ? persistence.current.value.sidebarWidth : 0,
      panelHeight:
        incomingState.panelPosition === 'bottom' ? persistence.current.value.panelHeight : 0,
      panelWidth:
        incomingState.panelPosition === 'right' ? persistence.current.value.panelWidth : 0,
    } satisfies LayoutState
  );

  // keep a ref to the state so we can get the latest state in the event handlers
  const stateRef = useRef<LayoutState>(state);
  Object.assign(stateRef.current, state, incomingState);

  // respond to state changes upstream
  useUpstreamState(stateRef, updateState, incomingState);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SHARED }} />
      <style media="(min-width: 600px)" dangerouslySetInnerHTML={{ __html: DESKTOP }} />
      <style media="(max-width: 599px)" dangerouslySetInnerHTML={{ __html: MOBILE }} />
      <style
        media="(min-width: 600px)"
        dangerouslySetInnerHTML={{ __html: getGridTemplate(state) }}
      />
      <div
        className="sb-layout"
        style={{
          gridTemplateColumns: `${state.sidebarWidth}% 0px 1fr 0 ${state.panelWidth}%`,
          gridTemplateRows: `1fr 0px ${state.panelHeight}%`,
        }}
      >
        <ContentContainer
          className="sb-content"
          hidden={state.viewMode !== 'story' && state.viewMode !== 'docs'}
        >
          {slots.slotMain}
        </ContentContainer>

        <ContentContainer
          className="sb-custom"
          hidden={!(state.viewMode !== 'story' && state.viewMode !== 'docs')}
        >
          {slots.slotCustom}
        </ContentContainer>

        <SidebarContainer className="sb-sidebar" hidden={state.sidebarWidth === 0}>
          {slots.slotSidebar}
        </SidebarContainer>
        <PanelContainer
          className="sb-panel"
          hidden={
            state.viewMode !== 'story' ||
            (state.panelPosition === 'bottom' && state.panelHeight === 0) ||
            (state.panelPosition === 'right' && state.panelWidth === 0) ||
            (state.panelPosition !== 'right' && state.panelPosition !== 'bottom')
          }
        >
          {slots.slotPanel}
        </PanelContainer>

        <DesktopControls {...{ state, stateRef, updateState }} />
        <MobileControls updateState={updateState} state={state} />
      </div>
    </>
  );
};

const PanelContainer = styled.div(({ theme }) => ({ backgroundColor: theme.background.app }));
const SidebarContainer = styled.div(({ theme }) => ({ backgroundColor: theme.background.app }));
const ContentContainer = styled.div(({ theme }) => ({ backgroundColor: theme.background.content }));

function useUpstreamState(
  stateRef: MutableRefObject<LayoutState>,
  updateState: Dispatch<Partial<LayoutState>>,
  incomingState: ExposedLayoutState
) {
  const { showPanel, panelPosition, showSidebar } = incomingState;
  useEffect(() => {
    const { panelHeight, sidebarWidth, panelWidth } = stateRef.current;
    if (showPanel && panelPosition === 'bottom' && panelHeight === 0) {
      // TODO: take from some preference
      updateState({
        panelHeight: 20,
        showPanel,
        panelPosition,
        showSidebar,
      });
      return;
    }
    if (showPanel && panelPosition === 'right' && panelWidth === 0) {
      // TODO: take from some preference
      updateState({
        panelWidth: 20,
        showPanel,
        panelPosition,
        showSidebar,
      });
      return;
    }
    if (!showPanel) {
      updateState({
        panelHeight: 0,
        panelWidth: 0,
        showPanel,
        panelPosition,
        showSidebar,
      });
      return;
    }
    if (showSidebar && sidebarWidth === 0) {
      // TODO: take from some preference
      updateState({
        sidebarWidth: 20,
        showPanel,
        panelPosition,
        showSidebar,
      });
      return;
    }
    if (!showSidebar && sidebarWidth !== 0) {
      updateState({
        sidebarWidth: 0,
        showPanel,
        panelPosition,
        showSidebar,
      });
    }
  }, [updateState, showPanel, panelPosition, showSidebar, stateRef]);
}

import type { Dispatch, MutableRefObject, Reducer } from 'react';
import React, { useReducer, useEffect, useRef } from 'react';
import { styled } from '@storybook/theming';
import { DESKTOP, getGridTemplate, MOBILE, SHARED } from './Layout.styles';
import type { Props, LayoutState, ExposedLayoutState } from './Layout.types';
import { MobileControls } from './Layout.MobileControls';
import { DesktopControls } from './Layout.DesktopControls';

export const Layout = ({ state: incomingState, persistence, setState, ...slots }: Props) => {
  const [state, updateState] = useReducer<Reducer<LayoutState, Partial<LayoutState>>>(
    (draft, action) => {
      if ('isPanelShown' in action || 'isSidebarShown' in action) {
        // sync changes upstream
        if (
          (action.isPanelShown !== undefined && action.isPanelShown !== draft.isPanelShown) ||
          (action.isSidebarShown !== undefined && action.isSidebarShown !== draft.isSidebarShown)
        ) {
          const { isPanelShown: draftPanel, isSidebarShown: draftSidebar } = draft;
          const { isPanelShown: actionPanel, isSidebarShown: actionSidebar } = action;
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

      return { ...draft, ...action };
    },
    {
      isDragging: false,
      isSidebarShown: incomingState.isSidebarShown || false,
      isPanelShown: incomingState.isPanelShown || false,
      viewMode: incomingState.viewMode || 'story',
      panelPosition: incomingState.panelPosition || persistence.current.value.panelPosition,
      sidebarWidth:
        incomingState.isSidebarShown === true ? persistence.current.value.sidebarWidth : 0,
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
  const { isPanelShown: showPanel, panelPosition, isSidebarShown: showSidebar } = incomingState;
  useEffect(() => {
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
}

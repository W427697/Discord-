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
      if ('panel' in action || 'sidebar' in action) {
        // sync changes upstream
        if (
          (action.panel !== undefined && action.panel !== draft.panel) ||
          (action.sidebar !== undefined && action.sidebar !== draft.sidebar)
        ) {
          const { panel: draftPanel, sidebar: draftSidebar } = draft;
          const { panel: actionPanel, sidebar: actionSidebar } = action;
          const update = {
            panel: actionPanel === undefined ? draftPanel : actionPanel,
            sidebar: actionSidebar === undefined ? draftSidebar : actionSidebar,
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
      sidebar: incomingState.sidebar || false,
      panel: incomingState.panel || false,
      viewMode: incomingState.viewMode || 'story',
      panelPosition: incomingState.panelPosition || persistence.current.value.panelPosition,
      sidebarWidth: incomingState.sidebar === true ? persistence.current.value.sidebarWidth : 0,
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

const PanelContainer = styled.div(({ theme }) => ({ bacgroundColor: theme.background.app }));
const SidebarContainer = styled.div(({ theme }) => ({ bacgroundColor: theme.background.app }));
const ContentContainer = styled.div(({ theme }) => ({ bacgroundColor: theme.background.content }));

function useUpstreamState(
  stateRef: MutableRefObject<LayoutState>,
  updateState: Dispatch<Partial<LayoutState>>,
  incomingState: ExposedLayoutState
) {
  const { panel, panelPosition, sidebar } = incomingState;
  useEffect(() => {
    const { panelHeight, sidebarWidth, panelWidth } = stateRef.current;
    if (panel && panelPosition === 'bottom' && panelHeight === 0) {
      // TODO: take from some preference
      updateState({ panelHeight: 20, panel, panelPosition, sidebar });
      return;
    }
    if (panel && panelPosition === 'right' && panelWidth === 0) {
      // TODO: take from some preference
      updateState({ panelWidth: 20, panel, panelPosition, sidebar });
      return;
    }
    if (!panel) {
      updateState({ panelHeight: 0, panelWidth: 0, panel, panelPosition, sidebar });
      return;
    }
    if (sidebar && sidebarWidth === 0) {
      // TODO: take from some preference
      updateState({ sidebarWidth: 20, panel, panelPosition, sidebar });
      return;
    }
    if (!sidebar && sidebarWidth !== 0) {
      updateState({ sidebarWidth: 0, panel, panelPosition, sidebar });
    }
  }, [updateState, panel, panelPosition, sidebar, stateRef]);
}

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useMemo } from 'react';
import { TabButton } from '@storybook/components';
import { styled } from '@storybook/theming';
import type { LayoutState } from './Layout.types';

const Bar = styled.nav(
  {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100vw',
    height: 40,
    display: 'flex',
    boxShadow: '0 1px 5px 0 rgba(0, 0, 0, 0.1)',

    '& > *': {
      flex: 1,
    },
  },
  ({ theme }) => ({
    background: theme.barBg,
  })
);

export const MobileControls = ({
  state,
  updateState,
}: {
  state: LayoutState;
  updateState: (state: Partial<LayoutState>) => void;
}) => {
  const k = state.panelPosition === 'bottom' ? state.panelHeight : state.panelWidth;
  const mobileNavShown = state.sidebarWidth !== 0;
  const mobilePanelShown = k !== 0 && mobileNavShown === false;

  const mobileActions = useMemo(() => {
    const setNavShown = () => {
      // TODO: 30 is an assumption
      updateState({
        showSidebar: true,
        showPanel: false,
        sidebarWidth: 30,
        panelWidth: 0,
        panelHeight: 0,
      });
    };

    const setPanelShown = () => {
      // TODO: 30 is an assumption
      updateState({
        showSidebar: false,
        showPanel: true,
        panelWidth: 30,
        panelHeight: 30,
        sidebarWidth: 0,
      });
    };
    const setContentShown = () => {
      updateState({
        showSidebar: false,
        showPanel: false,
        panelWidth: 0,
        panelHeight: 0,
        sidebarWidth: 0,
      });
    };

    return {
      setNavShown,
      setPanelShown,
      setContentShown,
    };
  }, [updateState]);

  return (
    <>
      <Bar className="sb-mobile-control">
        <TabButton onClick={mobileActions.setNavShown} active={mobileNavShown}>
          Sidebar
        </TabButton>
        <TabButton
          onClick={mobileActions.setContentShown}
          active={!mobileNavShown && !mobilePanelShown}
        >
          {state.viewMode === 'story' ? 'Canvas' : null}
          {state.viewMode === 'docs' ? 'Docs' : null}
          {state.viewMode !== 'docs' && state.viewMode !== 'story' ? 'Page' : null}
        </TabButton>
        <TabButton
          onClick={mobileActions.setPanelShown}
          active={mobilePanelShown}
          hidden={state.viewMode !== 'story'}
        >
          Addons
        </TabButton>
      </Bar>

      <div
        className="sb-mobile-dismiss"
        onClick={mobileActions.setContentShown}
        hidden={!mobileNavShown && !mobilePanelShown}
      />
    </>
  );
};

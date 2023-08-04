import type { FC } from 'react';
import React, { Fragment } from 'react';
import type { Addon_PageType } from '@storybook/types';
import type { State } from '@storybook/manager-api';
import { Route } from '@storybook/router';
import { Wrapper } from './Wrapper';
import { MainContainer } from './MainContainer';
import { SidebarContainer } from './SidebarContainer';
import { PreviewContainer } from './PreviewContainer';
import { PanelContainer } from './PanelContainer';
import type { IsDesktopProps, IsMobileProps } from './_types';
import { MobileNavigation } from './MobileNavigation';
import { Panel } from '../Panel/Panel';
import { Notifications } from '../Notifications/Notifications';
import { Sidebar } from '../Sidebar/Sidebar';
import { Preview } from '../Preview/Preview';

export interface LayoutProps {
  isReady: boolean;
  isMobile: IsMobileProps;
  isDesktop: IsDesktopProps;
  panelCount: number;
  pages: Addon_PageType[];
  options: State['layout'];
  viewMode: string;
  width: number;
  height: number;
}

export const Layout: FC<LayoutProps> = ({
  isDesktop,
  isMobile,
  isReady,
  options,
  width,
  height,
  viewMode,
  panelCount,
  pages,
}) => {
  return (
    <Fragment>
      {isDesktop && (
        <Notifications
          placement={{
            position: 'fixed',
            bottom: 20,
            left: 20,
          }}
        />
      )}
      {isReady && (
        <Wrapper
          options={options}
          bounds={{ width, height, top: 0, left: 0 }}
          viewMode={viewMode}
          panelCount={panelCount}
        >
          {({ navProps, mainProps, panelProps, previewProps }) => (
            <Fragment>
              <SidebarContainer {...navProps}>
                <Sidebar />
              </SidebarContainer>
              <MainContainer
                {...mainProps}
                isFullscreen={!!mainProps.isFullscreen}
                isMobile={isMobile}
              >
                <Route path={/(^\/story|docs|onboarding\/|^\/$)/} hideOnly>
                  {isMobile && <MobileNavigation />}
                  <PreviewContainer {...previewProps} hidden={false}>
                    <Preview id="main" withLoader />
                  </PreviewContainer>
                  <Route path="/story/" startsWith hideOnly>
                    <PanelContainer {...panelProps} hidden={false}>
                      <Panel />
                    </PanelContainer>
                  </Route>
                </Route>
                {pages.map(({ id, render: Content }) => (
                  <Fragment key={id}>
                    <Content />
                  </Fragment>
                ))}
              </MainContainer>
            </Fragment>
          )}
        </Wrapper>
      )}
    </Fragment>
  );
};

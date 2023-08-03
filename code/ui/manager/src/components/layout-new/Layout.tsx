import type { ComponentType, FC } from 'react';
import React, { Fragment } from 'react';
import type { Addon_PageType } from '@storybook/types';
import type { State } from '@storybook/manager-api';
import { Route } from '@storybook/router';
import { Wrapper } from './Wrapper';
import { Main } from './Main';
import { DesktopLeft } from './DesktopLeft';
import { PreviewContainer } from './PreviewContainer';
import { PanelContainer } from './PanelContainer';

interface LayoutProps {
  isReady: boolean;
  isMobile: boolean | null;
  isDesktop: boolean | null;
  panelCount: number;
  pages: Addon_PageType[];
  options: State['layout'];
  viewMode: string;
  width: number;
  height: number;
  Sidebar: ComponentType<any>;
  Preview: ComponentType<any>;
  Panel: ComponentType<any>;
  Notifications: ComponentType<any>;
}

export const Layout: FC<LayoutProps> = ({
  isDesktop,
  isReady,
  options,
  width,
  height,
  viewMode,
  panelCount,
  Sidebar,
  Preview,
  Panel,
  Notifications,
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
              <DesktopLeft {...navProps}>
                <Sidebar />
              </DesktopLeft>
              <Main {...mainProps} isFullscreen={!!mainProps.isFullscreen}>
                <Route path={/(^\/story|docs|onboarding\/|^\/$)/} hideOnly>
                  <PreviewContainer {...previewProps} hidden={false}>
                    <Preview id="main" />
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
              </Main>
            </Fragment>
          )}
        </Wrapper>
      )}
    </Fragment>
  );
};

import type { ComponentType, FC } from 'react';
import React, { Fragment } from 'react';
import type { Addon_PageType } from '@storybook/types';
import type { State } from '@storybook/manager-api';
import { Route } from '@storybook/router';
import type { IsDesktopProps, IsMobileProps } from './_types';
import * as S from './container';
import { MobileNavigation } from './MobileNavigation';

export interface LayoutProps {
  isMobile: IsMobileProps;
  isDesktop: IsDesktopProps;
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

const Layout: FC<LayoutProps> = Object.assign(
  React.memo<LayoutProps>(function Desktop({
    Panel,
    Sidebar,
    Preview,
    Notifications,
    pages,
    options,
    viewMode = undefined,
    width = 0,
    height = 0,
    panelCount,
    isDesktop,
    isMobile,
  }) {
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
        <S.Wrapper
          options={options}
          bounds={{ width, height, top: 0, left: 0 }}
          viewMode={viewMode}
          panelCount={panelCount}
        >
          {({ navProps, mainProps, panelProps, previewProps }) => (
            <Fragment>
              <S.Sidebar {...navProps}>
                <Sidebar />
              </S.Sidebar>
              <S.Main {...mainProps} isFullscreen={!!mainProps.isFullscreen} isMobile={isMobile}>
                <Route path={/(^\/story|docs|onboarding\/|^\/$)/} hideOnly>
                  {isMobile && <MobileNavigation Sidebar={Sidebar} />}
                  <S.Preview {...previewProps} hidden={false}>
                    <Preview id="main" />
                  </S.Preview>
                  <Route path="/story/" startsWith hideOnly>
                    <S.Panel {...panelProps} hidden={false}>
                      <Panel />
                    </S.Panel>
                  </Route>
                </Route>

                {pages.map(({ id, render: Content }) => (
                  <Fragment key={id}>
                    <Content />
                  </Fragment>
                ))}
              </S.Main>
            </Fragment>
          )}
        </S.Wrapper>
      </Fragment>
    );
  }),
  {
    displayName: 'Layout',
  }
);

export { Layout };

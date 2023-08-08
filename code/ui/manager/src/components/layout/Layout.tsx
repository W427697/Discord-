import type { ComponentType, FC } from 'react';
import React, { Fragment } from 'react';
import type { Addon_PageType } from '@storybook/types';
import type { State } from '@storybook/manager-api';
import { Route } from '@storybook/router';
import * as S from './container';
import { MobileNavigation } from '../MobileNavigation/MobileNavigation';
import { useLayout } from './_context';

export interface LayoutProps {
  panelCount: number;
  pages: Addon_PageType[];
  options: State['layout'];
  viewMode: string;
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
    panelCount,
  }) {
    const { isMobile, isDesktop, width, height } = useLayout();
    const isReady = !!width && !!height;

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
          <S.Wrapper
            options={options}
            bounds={{ width, height, top: 0, left: 0 }}
            viewMode={viewMode}
            panelCount={panelCount}
            isMobile={isMobile}
          >
            {({ navProps, mainProps, panelProps, previewProps }) => (
              <Fragment>
                {isDesktop && (
                  <S.Sidebar {...navProps}>
                    <Sidebar />
                  </S.Sidebar>
                )}
                <S.Main {...mainProps} isFullscreen={!!mainProps.isFullscreen} isMobile={isMobile}>
                  <Route path={/(^\/story|docs|onboarding\/|^\/$)/} hideOnly>
                    {isMobile && <MobileNavigation Sidebar={Sidebar} Panel={Panel} />}
                    <S.Preview {...previewProps} hidden={false}>
                      <Preview id="main" />
                    </S.Preview>
                    {isDesktop && (
                      <Route path="/story/" startsWith hideOnly>
                        <S.Panel {...panelProps} hidden={false}>
                          <Panel />
                        </S.Panel>
                      </Route>
                    )}
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
        )}
      </Fragment>
    );
  }),
  {
    displayName: 'Layout',
  }
);

export { Layout };

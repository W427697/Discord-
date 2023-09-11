import type { ComponentType } from 'react';
import React, { Fragment } from 'react';

import type { State } from '@storybook/manager-api';
import { Route } from '@storybook/router';
import type { Addon_PageType } from '@storybook/types';
import * as S from './container';
import { useLayout } from './LayoutContext';

export interface LayoutProps {
  panelCount: number;
  Sidebar: ComponentType<any>;
  Preview: ComponentType<any>;
  Panel: ComponentType<any>;
  Notifications: ComponentType<any>;
  pages: Addon_PageType[];
  options: State['layout'];
  viewMode: string;
}

const Layout = Object.assign(
  React.memo<LayoutProps>(function Layout({
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

    console.log('Yatta!!!');

    return (
      <Fragment>
        <Notifications
          placement={{
            position: 'fixed',
            bottom: 20,
            left: 20,
          }}
        />
        {isReady && (
          <S.Layout
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
                <S.Main {...mainProps} isFullscreen={!!mainProps.isFullscreen}>
                  <Route path={/(^\/story|docs|onboarding\/|^\/$)/} hideOnly>
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
          </S.Layout>
        )}
      </Fragment>
    );
  }),
  {
    displayName: 'Layout',
  }
);

export { Layout };

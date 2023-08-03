import type { FC } from 'react';
import React, { Fragment } from 'react';
import type { Addon_PageType } from '@storybook/types';
import type { State } from '@storybook/manager-api';
import Notifications from '../../containers/notifications';
import { Wrapper } from './containers/Wrapper';
import { Main } from './containers/Main';
import { DesktopLeft } from './containers/DesktopLeft';
import Sidebar from '../../containers/sidebar';

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
}

export const Layout: FC<LayoutProps> = ({
  isDesktop,
  isReady,
  options,
  width,
  height,
  viewMode,
  panelCount,
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
                Hello World
              </Main>
            </Fragment>
          )}
        </Wrapper>
      )}
    </Fragment>
  );
};

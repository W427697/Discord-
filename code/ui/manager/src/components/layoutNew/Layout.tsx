import type { FC } from 'react';
import React, { Fragment } from 'react';
import type { Addon_PageType } from '@storybook/types';
import type { State } from '@storybook/manager-api';
import { styled } from '@storybook/theming';
import Notifications from '../../containers/notifications';
import { Wrapper } from './Wrapper';

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

export const Root = styled.div({
  position: 'fixed',
  left: 0,
  top: 0,
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',

  '@media (min-width: 600px)': {
    position: 'relative',
    width: 'auto',
    height: 'auto',
    overflow: 'visible',
  },
});

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
    <Root>
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
          {({ navProps, mainProps, panelProps, previewProps }) => <Fragment>Hello World</Fragment>}
        </Wrapper>
      )}
    </Root>
  );
};

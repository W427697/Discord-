import type { FC } from 'react';
import React, { Fragment } from 'react';
import type { Addon_PageType } from '@storybook/types';
import type { State } from '@storybook/manager-api';
import Notifications from '../../containers/notifications';
import { Wrapper } from './Wrapper';

interface LayoutProps {
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
      {isDesktop && (
        <Wrapper
          options={options}
          bounds={{ width, height, top: 0, left: 0 }}
          viewMode={viewMode}
          panelCount={panelCount}
        >
          {({ navProps, mainProps, panelProps, previewProps }) => <Fragment>Hello World</Fragment>}
        </Wrapper>
      )}
    </Fragment>
  );
};

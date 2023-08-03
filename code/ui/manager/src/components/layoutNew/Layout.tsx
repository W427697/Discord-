import type { FC } from 'react';
import React, { Fragment } from 'react';
import type { Addon_PageType } from '@storybook/types';
import type { State } from '@storybook/manager-api';
import Notifications from '../../containers/notifications';

interface LayoutProps {
  isMobile: boolean | null;
  isDesktop: boolean | null;
  panelCount: number;
  pages: Addon_PageType[];
  options: State['layout'];
  viewMode: string;
}

export const Layout: FC<LayoutProps> = ({ isDesktop }) => {
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
    </Fragment>
  );
};

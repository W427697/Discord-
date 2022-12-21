import type { FC } from 'react';
import React, { useMemo } from 'react';

import { type State } from '@storybook/manager-api';
import { Route } from '@storybook/router';

import Sidebar from './containers/sidebar';
import Preview from './containers/preview';
import Panel from './containers/panel';
import Notifications from './containers/notifications';

import SettingsPages from './settings';
import { Layout } from './components/test/Layout';

export interface AppProps {
  viewMode: State['viewMode'];
  layout: State['layout'];
  panelCount: number;
}

const App = ({ viewMode, layout }: AppProps) => {
  const props = useMemo(
    () => ({
      Sidebar,
      Preview,
      Panel,
      Notifications,
      pages: [
        {
          key: 'settings',
          render: () => <SettingsPages />,
          route: (({ children }) => (
            <Route path="/settings/" startsWith>
              {children}
            </Route>
          )) as FC,
        },
      ],
    }),
    []
  );

  return (
    <Layout
      viewMode={viewMode}
      panel={layout.panelPosition}
      sidebar={layout.showNav}
      mainContent={<Preview id="1" withLoader />}
      sidebarContent={<Sidebar />}
      panelContent={<Panel />}
      customContent={props.pages.map(({ key, route: RouteX, render: Content }) => (
        <RouteX key={key}>
          <Content />
        </RouteX>
      ))}
    />
  );
};

export default App;

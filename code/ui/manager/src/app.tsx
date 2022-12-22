import type { FC } from 'react';
import React, { useMemo } from 'react';

import { type State } from '@storybook/manager-api';
import { Route } from '@storybook/router';

import { Global, createGlobal } from '@storybook/theming';
import { Symbols } from '@storybook/components';
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
    <>
      <Global styles={createGlobal} />
      <Symbols icons={['folder', 'component', 'document', 'bookmarkhollow']} />
      <Layout
        viewMode={viewMode}
        panel={layout.showPanel === false ? false : layout.panelPosition}
        sidebar={layout.showNav}
        slotMain={<Preview />}
        slotSidebar={<Sidebar />}
        slotPanel={<Panel />}
        slotCustom={props.pages.map(({ key, route: RouteX, render: Content }) => (
          <RouteX key={key}>
            <Content />
          </RouteX>
        ))}
      />
    </>
  );
};

export default App;

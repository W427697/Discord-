import React, { useMemo } from 'react';

import { type State } from '@storybook/manager-api';
import { Symbols } from '@storybook/components';
import { Global, createGlobal, styled } from '@storybook/theming';

import type { Addon_PageType } from '@storybook/types';
import { Layout } from './components/layout/Layout';
import Sidebar from './containers/sidebar';
import Preview from './containers/preview';
import Panel from './containers/panel';
import Notifications from './containers/notifications';
import { LayoutProvider } from './components/layout/LayoutContext';

const View = styled.div({
  position: 'fixed',
  overflow: 'hidden',
  height: '100vh',
  width: '100vw',
});

export interface AppProps {
  viewMode: State['viewMode'];
  layout: State['layout'];
  panelCount: number;
  pages: Addon_PageType[];
}

const App: React.FC<AppProps> = ({ viewMode, layout, panelCount, pages }) => {
  const props = useMemo(
    () => ({
      Sidebar,
      Preview,
      Panel,
      Notifications,
    }),
    []
  );

  return (
    <View>
      <Global styles={createGlobal} />
      <Symbols icons={['folder', 'component', 'document', 'bookmarkhollow']} />
      <LayoutProvider>
        <Layout
          {...props}
          viewMode={viewMode}
          options={layout}
          panelCount={panelCount}
          pages={pages}
        />
      </LayoutProvider>
    </View>
  );
};

App.displayName = 'App';

export default App;

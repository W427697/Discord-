import React, { useMemo } from 'react';
import { useResizeDetector } from 'react-resize-detector';

import { type State } from '@storybook/manager-api';
import { Symbols } from '@storybook/components';
import { Global, createGlobal, styled } from '@storybook/theming';

import type { Addon_PageType } from '@storybook/types';
import Sidebar from './containers/sidebar';
import Preview from './containers/preview';
import Panel from './containers/panel';
import Notifications from './containers/notifications';
import { Layout } from './components/layout/Layout';
import type { IsDesktopProps, IsMobileProps } from './components/layout/_types';
import { BREAKPOINT } from './components/layout/_constants';
import { LayoutProvider } from './components/layout/_context';

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
  const { width, height, ref } = useResizeDetector();
  const isReady = !!width && !!height;
  const isMobile: IsMobileProps | null = isReady ? width < BREAKPOINT : null;
  const isDesktop: IsDesktopProps | null = isReady ? width >= BREAKPOINT : null;

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
    <View ref={ref}>
      <Global styles={createGlobal} />
      <Symbols icons={['folder', 'component', 'document', 'bookmarkhollow']} />
      {isReady && (
        <LayoutProvider isMobile={isMobile} isDesktop={isDesktop} width={width} height={height}>
          <Layout
            {...props}
            viewMode={viewMode}
            options={layout}
            panelCount={panelCount}
            pages={pages}
          />
        </LayoutProvider>
      )}
    </View>
  );
};

App.displayName = 'App';

export default App;

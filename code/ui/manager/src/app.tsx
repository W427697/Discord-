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
  const isMobile: IsMobileProps = isReady ? width < BREAKPOINT : null;
  const isDesktop: IsDesktopProps = isReady ? width >= BREAKPOINT : null;

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
        <Layout
          {...props}
          viewMode={viewMode}
          options={layout}
          width={width}
          height={height}
          panelCount={panelCount}
          pages={pages}
          isMobile={isMobile}
          isDesktop={isDesktop}
          isReady={isReady}
        />
      )}
    </View>
  );
};

App.displayName = 'App';

export default App;

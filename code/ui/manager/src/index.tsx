import { global } from '@storybook/global';
import type { ComponentProps, FC } from 'react';
import React, { useCallback } from 'react';
import ReactDOM from 'react-dom';

import { Location, LocationProvider, useNavigate } from '@storybook/router';
import { Provider as ManagerProvider } from '@storybook/manager-api';
import type { Combo } from '@storybook/manager-api';
import {
  ThemeProvider,
  ensure as ensureTheme,
  CacheProvider,
  createCache,
} from '@storybook/theming';
import { HelmetProvider } from 'react-helmet-async';

import { App } from './App';

import Provider from './provider';

const emotionCache = createCache({ key: 'sto' });
emotionCache.compat = true;

// @ts-expect-error (Converted from ts-ignore)
ThemeProvider.displayName = 'ThemeProvider';
// @ts-expect-error (Converted from ts-ignore)
HelmetProvider.displayName = 'HelmetProvider';

export interface RootProps {
  provider: Provider;
  history?: History;
}

export const Root: FC<RootProps> = ({ provider }) => (
  <HelmetProvider key="helmet.Provider">
    <LocationProvider key="location.provider">
      <Main provider={provider} />
    </LocationProvider>
  </HelmetProvider>
);

const appFilter = ({ api, state }: Combo, isLoading: boolean) => {
  const result: ComponentProps<typeof App> = {
    panelPosition: state.layout.panelPosition || 'bottom',
    isPanelShown: isLoading ? false : state.layout.showPanel,
    isSidebarShown: state.layout.showNav,
    viewMode: state.viewMode,
    updater: useCallback(
      (s) => {
        api.setOptions({
          layout: {
            ...(typeof s.isPanelShown !== 'undefined' ? { showPanel: s.isPanelShown } : {}),
            ...(typeof s.isSidebarShown !== 'undefined' ? { showNav: s.isSidebarShown } : {}),
          },
        });
      },
      [api]
    ),
  };

  return result;
};

const Main: FC<{ provider: Provider }> = ({ provider }) => {
  const navigate = useNavigate();
  return (
    <Location key="location.consumer">
      {(locationData) => (
        <ManagerProvider
          key="manager"
          provider={provider}
          {...locationData}
          navigate={navigate}
          docsOptions={global?.DOCS_OPTIONS || {}}
        >
          {(combo: Combo) => {
            const { state, api } = combo;
            const story = api.getData(state.storyId, state.refId);
            const isLoading = story
              ? !!state.refs[state.refId] && !state.refs[state.refId].ready
              : !state.storiesFailed && !state.storiesConfigured;

            return (
              <CacheProvider value={emotionCache}>
                <ThemeProvider key="theme.provider" theme={ensureTheme(state.theme)}>
                  <App key="app" {...appFilter(combo, isLoading)} />
                </ThemeProvider>
              </CacheProvider>
            );
          }}
        </ManagerProvider>
      )}
    </Location>
  );
};

export function renderStorybookUI(domNode: HTMLElement, provider: Provider) {
  if (!(provider instanceof Provider)) {
    throw new Error('provider is not extended from the base Provider');
  }

  ReactDOM.render(<Root key="root" provider={provider} />, domNode);
}

export { Provider };

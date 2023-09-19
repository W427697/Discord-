import { global } from '@storybook/global';
import type { FC } from 'react';
import React, { useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';

import { Location, LocationProvider, useNavigate } from '@storybook/router';
import { Provider as ManagerProvider, types } from '@storybook/manager-api';
import type { Combo } from '@storybook/manager-api';
import { ThemeProvider, ensure as ensureTheme } from '@storybook/theming';
import { ProviderDoesNotExtendBaseProviderError } from '@storybook/core-events/manager-errors';

import { HelmetProvider } from 'react-helmet-async';

import type { Addon_PageType } from '@storybook/types';
import { App } from './App';

import Provider from './provider';
import { settingsPageAddon } from './settings/index';

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
            const setManagerLayoutState = useCallback(
              (sizes) => {
                api.setSizes(sizes);
              },
              [state, api]
            );

            const pages: Addon_PageType[] = useMemo(
              () => [settingsPageAddon, ...Object.values(api.getElements(types.experimental_PAGE))],
              [Object.keys(api.getElements(types.experimental_PAGE)).join()]
            );

            return (
              <ThemeProvider key="theme.provider" theme={ensureTheme(state.theme)}>
                <App
                  key="app"
                  pages={pages}
                  managerLayoutState={{ ...state.layout, viewMode: state.viewMode }}
                  setManagerLayoutState={setManagerLayoutState}
                />
              </ThemeProvider>
            );
          }}
        </ManagerProvider>
      )}
    </Location>
  );
};

export function renderStorybookUI(domNode: HTMLElement, provider: Provider) {
  if (!(provider instanceof Provider)) {
    throw new ProviderDoesNotExtendBaseProviderError();
  }

  ReactDOM.render(<Root key="root" provider={provider} />, domNode);
}

export { Provider };

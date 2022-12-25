import { action } from '@storybook/addon-actions';
import React from 'react';

import { Provider as ManagerProvider } from '@storybook/manager-api';
import { LocationProvider } from '@storybook/router';
import { HelmetProvider } from 'react-helmet-async';
import { App } from './App_renamed';
import { PrettyFakeProvider, FakeProvider } from './FakeProvider';

export default {
  component: App,
  parameters: {
    layout: 'fullscreen',
    theme: 'light',
  },
  decorators: [
    (StoryFn: any) => (
      <HelmetProvider key="helmet.Provider">
        <LocationProvider>
          <StoryFn />
        </LocationProvider>
      </HelmetProvider>
    ),
  ],
};

export const Light = () => (
  <ManagerProvider
    key="manager"
    provider={new FakeProvider()}
    path="/story/ui-app--loading-state"
    storyId="ui-app--loading-state"
    location={{ search: '' }}
    navigate={() => {}}
    docsOptions={{ docsMode: false }}
  >
    <App
      key="app"
      viewMode="story"
      panel
      sidebar
      panelPosition="right"
      updater={action('updater')}
    />
  </ManagerProvider>
);

export const Dark = () => (
  <ManagerProvider
    key="manager"
    provider={new PrettyFakeProvider()}
    path=""
    storyId="ui-app--loading-state"
    location={{ search: '' }}
    navigate={() => {}}
    docsOptions={{ docsMode: false }}
  >
    <App
      key="app"
      viewMode="story"
      panel
      sidebar
      panelPosition="right"
      updater={action('updater')}
    />
  </ManagerProvider>
);
Dark.parameters = {
  theme: 'dark',
};

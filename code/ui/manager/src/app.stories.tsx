import { action } from '@storybook/addon-actions';
import React from 'react';

import { Provider as ManagerProvider } from '@storybook/manager-api';
import { LocationProvider } from '@storybook/router';
import { HelmetProvider } from 'react-helmet-async';
import { styled } from '@storybook/theming';
import { App } from './app';
import { PrettyFakeProvider, FakeProvider } from './FakeProvider';

export default {
  component: App,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (StoryFn: any) => (
      <HelmetProvider key="helmet.Provider">
        <LocationProvider>
          <ThemeStack>
            <StoryFn />
          </ThemeStack>
        </LocationProvider>
      </HelmetProvider>
    ),
  ],
};

const ThemeStack = styled.div(
  {
    position: 'relative',
    minHeight: '50vh',
    height: '100%',
  },
  ({ theme }) => ({
    background: theme.background.app,
    color: theme.color.defaultText,
  })
);

export const Default = () => (
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

export const LoadingState = () => (
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

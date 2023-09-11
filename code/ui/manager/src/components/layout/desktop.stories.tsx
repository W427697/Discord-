import React from 'react';
import type { DecoratorFn } from '@storybook/react';

import isChromatic from 'chromatic/isChromatic';

import { BaseLocationProvider } from '@storybook/router';
import { types } from '@storybook/manager-api';
import type { LayoutProps } from './Layout';
import { Layout } from './Layout';

import { store } from './persist';
import { mockProps, realProps, MockPage } from './app.mockdata';

export default {
  title: 'Layout/Desktop',
  component: Layout,
  parameters: {
    passArgsFirst: false,
    path: 'story/my-id',
    layout: 'fullscreen',
    viewport: {
      viewports: {
        tablet: {
          name: 'Tablet',
          styles: {
            height: '1112px',
            width: '834px',
          },
          type: 'tablet',
        },
      },
      defaultViewport: 'tablet',
      defaultOrientation: 'landscape',
    },
    theme: 'light',
    chromatic: { viewports: [1112] },
  },
  decorators: [
    ((StoryFn, c) => {
      const mocked = true;

      if (isChromatic()) {
        store.local.set(`storybook-layout`, {});
      }

      const props = mocked ? mockProps : realProps;

      return (
        <BaseLocationProvider location={`/?path=/${c.parameters.path}`} navigator={{} as any}>
          <div style={{ height: '100vh', width: '100vw', position: 'absolute', top: 0, left: 0 }}>
            <StoryFn props={props} {...c} />
          </div>
        </BaseLocationProvider>
      );
    }) as DecoratorFn,
  ],
};

export const Default = ({ props }: { props: LayoutProps }) => <Layout {...props} />;
export const NoAddons = ({ props }: { props: LayoutProps }) => <Layout {...props} panelCount={0} />;
export const NoSidebar = ({ props }: { props: LayoutProps }) => (
  <Layout {...props} options={{ ...props.options, showNav: false }} />
);
export const NoPanel = ({ props }: { props: LayoutProps }) => (
  <Layout {...props} options={{ ...props.options, showPanel: false }} />
);
export const BottomPanel = ({ props }: { props: LayoutProps }) => (
  <Layout {...props} options={{ ...props.options, panelPosition: 'bottom' }} />
);
export const Fullscreen = ({ props }: { props: LayoutProps }) => (
  <Layout {...props} options={{ ...props.options, isFullscreen: true }} />
);
export const NoPanelNoSidebar = ({ props }: { props: LayoutProps }) => (
  <Layout {...props} options={{ ...props.options, showPanel: false, showNav: false }} />
);
export const Page = ({ props }: { props: LayoutProps }) => (
  <Layout
    {...props}
    pages={[
      {
        id: '/settings/',
        title: 'Settings',
        url: '/settings/',
        type: types.experimental_PAGE,
        render: () => <MockPage />,
      },
    ]}
  />
);
Page.parameters = { path: '/settings/' };

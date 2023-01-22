import { action } from '@storybook/addon-actions';
import type { FC } from 'react';
import React from 'react';

import { styled } from '@storybook/theming';
import { Layout } from './Layout';
import { DEFAULTS } from './Layout.persistence';

const PlaceholderBlock = styled.div(({ color }) => ({
  background: color || 'hotpink',
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
}));

const PlaceholderClock: FC<{ color: string }> = ({ color, children }) => {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [count]);
  return (
    <PlaceholderBlock color={color}>
      <h2
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          color: 'rgba(0,0,0,0.2)',
          fontSize: '150px',
          lineHeight: '150px',
          margin: '-20px',
        }}
      >
        {count}
      </h2>
      {children}
    </PlaceholderBlock>
  );
};

const MockSidebar: FC<any> = (props) => (
  <PlaceholderClock color="#F6F9FC">
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </PlaceholderClock>
);

const MockPreview: FC<any> = (props) => (
  <PlaceholderClock color="#E6E9EC">
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </PlaceholderClock>
);

const MockPanel: FC<any> = (props) => (
  <PlaceholderClock color="#FFFFFF">
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </PlaceholderClock>
);

const MockPage: FC<any> = (props) => (
  <PlaceholderClock color="cyan">
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </PlaceholderClock>
);

const defaultState = {
  isSidebarShown: true,
  isPanelShown: true,
  panelPosition: 'bottom',
  viewMode: 'story',
};

export default {
  title: 'Layout',
  component: Layout,
  args: {
    state: defaultState,
    setState: action('setState'),
    persistence: { current: { value: DEFAULTS, set: action('setPersistence') } },
    slotMain: <MockPreview />,
    slotSidebar: <MockSidebar />,
    slotPanel: <MockPanel />,
    slotCustom: <MockPage />,
  },
  parameters: {
    theme: 'light',
    layout: 'fullscreen',
  },
};

export const Desktop = {};
export const Dark = {
  parameters: { theme: 'dark' },
};
export const DesktopHorizontal = {
  args: {
    state: { ...defaultState, panelPosition: 'right' },
  },
};

export const DesktopDocs = {
  args: {
    state: { ...defaultState, viewMode: 'docs' },
  },
};

export const DesktopCustom = {
  args: {
    state: { ...defaultState, viewMode: 'custom' },
  },
};

export const Mobile = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    chromatic: { viewports: [320] },
  },
};
export const MobileHorizontal = {
  args: {
    state: { ...defaultState, panelPosition: 'right' },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    chromatic: { viewports: [320] },
  },
};

export const MobileDocs = {
  args: {
    state: { ...defaultState, viewMode: 'docs' },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    chromatic: { viewports: [320] },
  },
};

export const MobileCustom = {
  args: {
    state: { ...defaultState, viewMode: 'custom' },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    chromatic: { viewports: [320] },
  },
};

import { action } from '@storybook/addon-actions';
import type { FC } from 'react';
import React, { useState } from 'react';

import { styled } from '@storybook/theming';
import type { Meta } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';
import { Layout } from './Layout';

const PlaceholderBlock = styled.div({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
});

const PlaceholderClock: FC = ({ children }) => {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [count]);
  return (
    <PlaceholderBlock>
      <h2>{count}</h2>
      {children}
    </PlaceholderBlock>
  );
};

const MockSidebar: FC<any> = () => <PlaceholderClock />;

const MockPreview: FC<any> = () => <PlaceholderClock />;

const MockPanel: FC<any> = () => <PlaceholderClock />;

const MockPage: FC<any> = () => <PlaceholderClock />;

const defaultState = {
  navSize: 30,
  bottomPanelHeight: 30,
  rightPanelWidth: 30,
  panelPosition: 'bottom',
  viewMode: 'story',
} as const;

const meta = {
  title: 'Layout',
  component: Layout,
  args: {
    managerLayoutState: defaultState,
    slotMain: <MockPreview />,
    slotSidebar: <MockSidebar />,
    slotPanel: <MockPanel />,
    slotPages: <MockPage />,
  },
  parameters: {
    theme: 'light',
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', width: '100vw' }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => {
    const [managerStoreState, setManagerStoreState] = useState(args.managerLayoutState);

    return (
      <Layout
        {...args}
        managerLayoutState={managerStoreState}
        setManagerLayoutState={(nextPartialState) => {
          setManagerStoreState({ ...managerStoreState, ...nextPartialState });
          action('setManagerStoreState')(nextPartialState);
        }}
      />
    );
  },
} satisfies Meta<typeof Layout>;

export default meta;

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

export const DesktopPages = {
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

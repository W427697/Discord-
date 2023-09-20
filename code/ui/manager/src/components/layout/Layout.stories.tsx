import { action } from '@storybook/addon-actions';
import type { FC } from 'react';
import React, { useState } from 'react';

import { styled } from '@storybook/theming';
import type { Meta, StoryObj } from '@storybook/react';
import { ManagerContext } from '@storybook/manager-api';
import { Layout } from './Layout';
import { MobileLayoutProvider } from '../mobile/MobileLayoutProvider';

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
  navSize: 150,
  bottomPanelHeight: 150,
  rightPanelWidth: 150,
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
    (storyFn) => (
      <ManagerContext.Provider
        value={
          {
            api: {
              getCurrentStoryData: () => ({
                title: 'Some Story Title',
              }),
            },
          } as any
        }
      >
        <MobileLayoutProvider>{storyFn()}</MobileLayoutProvider>
      </ManagerContext.Provider>
    ),
  ],
  render: (args) => {
    const [managerLayoutState, setManagerLayoutState] = useState(args.managerLayoutState);

    return (
      <Layout
        {...args}
        managerLayoutState={managerLayoutState}
        setManagerLayoutState={(nextPartialState) => {
          setManagerLayoutState({ ...managerLayoutState, ...nextPartialState });
          action('setManagerStoreState')(nextPartialState);
        }}
      />
    );
  },
} satisfies Meta<typeof Layout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};
export const Dark: Story = {
  parameters: { theme: 'dark' },
};
export const DesktopHorizontal: Story = {
  args: {
    managerLayoutState: { ...defaultState, panelPosition: 'right' },
  },
};

export const DesktopDocs: Story = {
  args: {
    managerLayoutState: { ...defaultState, viewMode: 'docs' },
  },
};

export const DesktopPages: Story = {
  args: {
    managerLayoutState: { ...defaultState, viewMode: 'settings' },
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

export const MobileDocs = {
  ...Mobile,
  args: {
    state: { ...defaultState, viewMode: 'docs' },
  },
};

export const MobilePages = {
  ...Mobile,
  args: {
    state: { ...defaultState, viewMode: 'settings' },
  },
};

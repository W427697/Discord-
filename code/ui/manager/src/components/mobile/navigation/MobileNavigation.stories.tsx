import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ManagerContext } from '@storybook/manager-api';
import { within } from '@storybook/testing-library';
import { MobileNavigation } from './MobileNavigation';
import { MobileLayoutProvider, useMobileLayoutContext } from '../MobileLayoutProvider';

const MockPanel = () => {
  const { setMobilePanelOpen } = useMobileLayoutContext();
  return (
    <div>
      panel
      <button type="button" title="Close addon panel" onClick={() => setMobilePanelOpen(false)}>
        close
      </button>
    </div>
  );
};

const meta = {
  component: MobileNavigation,
  title: 'Mobile/Navigation',
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
        <MobileLayoutProvider>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100svh' }}>
            <div style={{ flex: 1 }} />
            {storyFn()}
          </div>
        </MobileLayoutProvider>
      </ManagerContext.Provider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
    chromatic: { viewports: [320] },
  },
  args: {
    sidebar: () => <div>sidebar</div>,
    panel: <MockPanel />,
  },
} satisfies Meta<typeof MobileNavigation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {},
};

export const MenuOpen: Story = {
  play: async ({ canvasElement }) => {
    const menuOpen = await within(canvasElement).getByTitle('Open navigation menu');
    await menuOpen.click();
  },
};

export const MenuClosed: Story = {
  play: async (context) => {
    await MenuOpen.play(context);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const overlay = await within(context.canvasElement).getByLabelText('Close navigation menu');
    await overlay.click();
  },
};

export const PanelOpen: Story = {
  play: async ({ canvasElement }) => {
    const panelButton = await within(canvasElement).getByTitle('Open addon panel');
    await panelButton.click();
  },
};

export const PanelClosed: Story = {
  play: async (context) => {
    await PanelOpen.play(context);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const closeButton = await within(context.canvasElement).getByTitle('Close addon panel');
    await closeButton.click();
  },
};

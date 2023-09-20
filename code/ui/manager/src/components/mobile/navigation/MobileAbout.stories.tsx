import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { MobileNavigation } from './MobileNavigation';

const meta = {
  component: MobileNavigation,
  title: 'MobileNavigation',
  decorators: [
    (storyFn) => (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100svh' }}>
        <div style={{ flex: 1 }} />
        {storyFn()}
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof MobileNavigation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    chromatic: { viewports: [320] },
  },
  args: {},
};

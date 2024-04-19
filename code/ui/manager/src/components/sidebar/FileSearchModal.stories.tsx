import type { Meta, StoryObj } from '@storybook/react';

import { FileSearchModal } from './FileSearchModal';

const meta = {
  component: FileSearchModal,
} satisfies Meta<typeof FileSearchModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true
  }
};
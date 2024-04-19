import type { Meta, StoryObj } from '@storybook/react';

import VitestConfig from './vitest.config';

const meta = {
  component: VitestConfig,
} satisfies Meta<typeof VitestConfig>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
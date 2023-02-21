import type { Meta, StoryObj } from '@storybook/react';

import { EmptyExample } from './EmptyExample';

const meta = {
  title: 'examples/Stories for the Stories and Primary Block',
  component: EmptyExample,
} satisfies Meta<typeof EmptyExample>;
export default meta;

type Story = StoryObj<typeof meta>;

export const SingleStory: Story = {};

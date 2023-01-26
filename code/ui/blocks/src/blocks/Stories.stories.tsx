import type { Meta, StoryObj } from '@storybook/react';
import { Stories } from './Stories';

const meta = {
  component: Stories,
} satisfies Meta<typeof Stories>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    relativeCsfPaths: ['../examples/Button.stories'],
  },
};
export const WithoutToolbar: Story = {
  parameters: {
    relativeCsfPaths: ['../examples/StoriesParameters.stories'],
  },
};

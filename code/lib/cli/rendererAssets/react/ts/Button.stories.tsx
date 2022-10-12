import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

// More on meta: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Example/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {
    primary: true,
    label: 'Button',
  },
} satisfies Story;

export const Secondary = {
  args: {
    label: 'Button',
  },
} satisfies Story;

export const Large = {
  args: {
    size: 'large',
    label: 'Button',
  },
} satisfies Story;

export const Small = {
  args: {
    size: 'small',
    label: 'Button',
  },
} satisfies Story;

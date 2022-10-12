import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

// More on meta: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Button> = {
  title: 'Example/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

export default meta;

export const Primary: StoryObj<typeof Button> = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {
    primary: true,
    label: 'Button',
  },
};

export const Secondary: StoryObj<typeof Button> = {
  args: {
    label: 'Button',
  },
};

export const Large: StoryObj<typeof Button> = {
  args: {
    size: 'large',
    label: 'Button',
  },
};

export const Small: StoryObj<typeof Button> = {
  args: {
    size: 'small',
    label: 'Button',
  },
};

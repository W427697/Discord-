import type { Meta, StoryObj } from '@storybook/preact';
import type { ComponentProps } from 'preact';
import Typed from './Typed';

const meta = {
  component: Typed,
} satisfies Meta<ComponentProps<typeof Typed>>;

export default meta;

export const Default: StoryObj<ComponentProps<typeof Typed>> = {
  args: {
    name: 'John Doe',
    email: 'john@example.org',
    credits: 4800.15,
  },
};

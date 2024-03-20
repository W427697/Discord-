import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'examples/Button Readonly',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: {
      control: 'color',
      table: { readonly: true },
    },
    primary: {
      table: { readonly: true },
    },
    label: {
      table: { readonly: true },
    },
    size: {
      table: { readonly: true },
    },
  },
  parameters: {
    // Stop *this* story from being stacked in Chromatic
    theme: 'default',
    // these are to test the deprecated features of the Description block
    notes: 'These are notes for the Button stories',
    info: 'This is info for the Button stories',
    jsx: { useBooleanShorthandSyntax: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};

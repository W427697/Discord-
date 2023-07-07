import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Base = { args: { children: 'Hello World' } };

export const Sizes: Story = {
  args: {
    ...Base.args,
  },
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Button size="sm">Button Small</Button>
      <Button size="md">Button Medium</Button>
    </div>
  ),
};

export const Variants: Story = {
  args: {
    ...Base.args,
  },
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Button variant="solid" size="sm">
          Button Solid
        </Button>
        <Button variant="solid" size="md">
          Button Solid
        </Button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Button variant="outline" size="sm">
          Button Outline
        </Button>
        <Button variant="outline" size="md">
          Button Outline
        </Button>
      </div>
    </div>
  ),
};

export const Colors: Story = {
  args: {
    ...Base.args,
  },
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Button color="blue">Button Blue</Button>
      <Button color="gray">Button Gray</Button>
    </div>
  ),
};

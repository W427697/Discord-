import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Icon } from '@storybook/components/experimental';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Base = {
  args: { children: 'Button' },
};

export const Types: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Button variant="solid">Solid</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};

export const Active: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Button variant="solid" active>
        Solid
      </Button>
      <Button variant="outline" active>
        Outline
      </Button>
      <Button variant="ghost" active>
        Ghost
      </Button>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Button variant="solid" icon={<Icon.FaceHappy />}>
        Solid
      </Button>
      <Button variant="outline" icon={<Icon.FaceHappy />}>
        Outline
      </Button>
      <Button variant="ghost" icon={<Icon.FaceHappy />}>
        Ghost
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Button size="small" icon={<Icon.FaceHappy />}>
        Small Button
      </Button>
      <Button size="medium" icon={<Icon.FaceHappy />}>
        Medium Button
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

export const WithHref: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Button onClick={() => console.log('Hello')}>I am a button using onClick</Button>
      <Button as="a" href="https://storybook.js.org/">
        I am an anchor using Href
      </Button>
    </div>
  ),
};

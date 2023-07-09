import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    isLink: { table: { disable: true } },
    primary: { table: { disable: true } },
    secondary: { table: { disable: true } },
    tertiary: { table: { disable: true } },
    gray: { table: { disable: true } },
    inForm: { table: { disable: true } },
    small: { table: { disable: true } },
    outline: { table: { disable: true } },
    containsIcon: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Base = {
  args: { children: 'Button' },
};

export const Types: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Button type="primary">Primary Button</Button>
      <Button type="secondary">Secondary Button</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Button size="small">Small Button</Button>
      <Button size="medium">Medium Button</Button>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Button variant="solid" type="primary">
          Button Primary Solid
        </Button>
        <Button variant="solid" type="secondary">
          Button Secondary Solid
        </Button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Button variant="outline" type="primary">
          Button Primary Outline
        </Button>
        <Button variant="outline" type="secondary">
          Button Secondary Outline
        </Button>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

export const Link: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Button onClick={() => console.log('Hello')}>I am a button</Button>
      <Button href="https://storybook.js.org/">I am a link</Button>
    </div>
  ),
};

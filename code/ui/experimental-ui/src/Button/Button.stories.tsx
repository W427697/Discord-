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
      <Button type="primary">Primary</Button>
      <Button type="secondary">Secondary</Button>
      <Button type="tertiary">Tertiary</Button>
    </div>
  ),
};

export const Active: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Button type="primary" active>
        Primary
      </Button>
      <Button type="secondary" active>
        Secondary
      </Button>
      <Button type="tertiary" active>
        Tertiary
      </Button>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Button type="primary" icon={<div>Hello</div>}>
        Primary
      </Button>
      <Button type="secondary" icon={<div>Hello</div>}>
        Secondary
      </Button>
      <Button type="tertiary" icon={<div>Hello</div>}>
        Tertiary
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Button size="small" icon={<div>Hello</div>}>
        Small Button
      </Button>
      <Button size="small" icon={<div>Hello</div>} iconOnly>
        Small Button
      </Button>
      <Button size="medium" icon={<div>Hello</div>}>
        Medium Button
      </Button>
      <Button size="medium" icon={<div>Hello</div>} iconOnly>
        Medium Button
      </Button>
    </div>
  ),
};

export const IconOnly: Story = {
  parameters: {
    docs: {
      description: {
        story: 'This is a story that shows how to use the `iconOnly` prop.',
      },
      source: {
        type: 'dynamic',
      },
    },
  },
  render: () => (
    <>
      <Button size="small" type="primary" iconOnly icon={<div>Hello</div>}>
        Primary
      </Button>
      <Button size="small" type="secondary" iconOnly icon={<div>Hello</div>}>
        Secondary
      </Button>
      <Button size="small" type="tertiary" iconOnly icon={<div>Hello</div>}>
        Tertiary
      </Button>
      <Button size="medium" type="primary" iconOnly icon={<div>Hello</div>}>
        Primary
      </Button>
      <Button size="medium" type="secondary" iconOnly icon={<div>Hello</div>}>
        Secondary
      </Button>
      <Button size="medium" type="tertiary" iconOnly icon={<div>Hello</div>}>
        Tertiary
      </Button>
    </>
  ),
  decorators: [
    (Story) => <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>{Story()}</div>,
  ],
};

export const IconOnlyActive: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Button size="small" type="primary" iconOnly icon={<div>Hello</div>} active>
        Primary
      </Button>
      <Button size="small" type="secondary" iconOnly icon={<div>Hello</div>} active>
        Secondary
      </Button>
      <Button size="small" type="tertiary" iconOnly icon={<div>Hello</div>} active>
        Tertiary
      </Button>
      <Button size="medium" type="primary" iconOnly icon={<div>Hello</div>} active>
        Primary
      </Button>
      <Button size="medium" type="secondary" iconOnly icon={<div>Hello</div>} active>
        Secondary
      </Button>
      <Button size="medium" type="tertiary" iconOnly icon={<div>Hello</div>} active>
        Tertiary
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
      <Button href="https://storybook.js.org/">I am an anchor using Href</Button>
    </div>
  ),
};

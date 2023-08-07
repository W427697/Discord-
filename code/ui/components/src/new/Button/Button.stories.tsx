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
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
    </div>
  ),
};

export const Active: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Button variant="primary" active>
        Primary
      </Button>
      <Button variant="secondary" active>
        Secondary
      </Button>
      <Button variant="tertiary" active>
        Tertiary
      </Button>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Button variant="primary" icon={<Icon.FaceHappy />}>
        Primary
      </Button>
      <Button variant="secondary" icon={<Icon.FaceHappy />}>
        Secondary
      </Button>
      <Button variant="tertiary" icon={<Icon.FaceHappy />}>
        Tertiary
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
      <Button size="small" icon={<Icon.FaceHappy />} iconOnly />
      <Button size="medium" icon={<Icon.FaceHappy />}>
        Medium Button
      </Button>
      <Button size="medium" icon={<Icon.FaceHappy />} iconOnly />
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
      <Button size="small" variant="primary" iconOnly icon={<Icon.FaceHappy />} />
      <Button size="small" variant="secondary" iconOnly icon={<Icon.FaceHappy />} />
      <Button size="small" variant="tertiary" iconOnly icon={<Icon.FaceHappy />} />
      <Button size="medium" variant="primary" iconOnly icon={<Icon.FaceHappy />} />
      <Button size="medium" variant="secondary" iconOnly icon={<Icon.FaceHappy />} />
      <Button size="medium" variant="tertiary" iconOnly icon={<Icon.FaceHappy />} />
    </>
  ),
  decorators: [
    (Story) => <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>{Story()}</div>,
  ],
};

export const IconOnlyActive: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Button size="small" variant="primary" iconOnly icon={<Icon.FaceHappy />} active />
      <Button size="small" variant="secondary" iconOnly icon={<Icon.FaceHappy />} active />
      <Button size="small" variant="tertiary" iconOnly icon={<Icon.FaceHappy />} active />
      <Button size="medium" variant="primary" iconOnly icon={<Icon.FaceHappy />} active />
      <Button size="medium" variant="secondary" iconOnly icon={<Icon.FaceHappy />} active />
      <Button size="medium" variant="tertiary" iconOnly icon={<Icon.FaceHappy />} active />
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

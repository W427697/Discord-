import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Icon } from '@storybook/components/experimental';
import { IconButton } from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'IconButton',
  component: IconButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Base = {
  args: { icon: <Icon.FaceHappy /> },
};

export const Types: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <IconButton variant="solid" icon={<Icon.FaceHappy />} />
      <IconButton variant="outline" icon={<Icon.FaceHappy />} />
      <IconButton variant="ghost" icon={<Icon.FaceHappy />} />
    </div>
  ),
};

export const Active: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <IconButton variant="solid" icon={<Icon.FaceHappy />} active />
      <IconButton variant="outline" icon={<Icon.FaceHappy />} active />
      <IconButton variant="ghost" icon={<Icon.FaceHappy />} active />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <IconButton size="small" icon={<Icon.FaceHappy />} />
      <IconButton size="medium" icon={<Icon.FaceHappy />} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    ...Base.args,
    disabled: true,
  },
};

export const WithHref: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <IconButton icon={<Icon.FaceHappy />} onClick={() => console.log('Hello')} />
      <IconButton as="a" href="https://storybook.js.org/" icon={<Icon.FaceHappy />} />
    </div>
  ),
};

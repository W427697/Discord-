import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { IconButton } from './IconButton';
import { Icons } from '../icon/icon';

const meta = {
  title: 'IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: { children: <Icons icon="facehappy" /> },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base = {};

export const Types: Story = {
  render: ({ ...args }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <IconButton {...args} variant="solid" />
      <IconButton {...args} variant="outline" />
      <IconButton {...args} variant="ghost" />
    </div>
  ),
};

export const Active: Story = {
  args: { active: true },
  render: ({ ...args }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <IconButton {...args} variant="solid" />
      <IconButton {...args} variant="outline" />
      <IconButton {...args} variant="ghost" />
    </div>
  ),
};

export const Sizes: Story = {
  args: { variant: 'solid' },
  render: ({ ...args }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <IconButton {...args} size="small" />
      <IconButton {...args} size="medium" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: ({ ...args }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <IconButton {...args} variant="solid" />
      <IconButton {...args} variant="outline" />
      <IconButton {...args} variant="ghost" />
    </div>
  ),
};

export const Animated: Story = {
  render: ({ ...args }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <IconButton {...args} onClickAnimation="glow" />
      <IconButton {...args} onClickAnimation="rotate360" />
      <IconButton {...args} onClickAnimation="jiggle" />
    </div>
  ),
};

export const WithHref: Story = {
  render: ({ ...args }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <IconButton {...args} onClick={() => console.log('Hello')} />
      <IconButton {...args} asChild>
        <a href="https://storybook.js.org/" aria-label="Visit Storybook website">
          <Icons icon="facehappy" />
        </a>
      </IconButton>
    </div>
  ),
};

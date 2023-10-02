import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { IconButton } from './IconButton';
import { Icons } from '../icon/icon';

const meta: Meta<typeof IconButton> = {
  title: 'IconButton',
  component: IconButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Base = {
  args: { icon: <Icons icon="facehappy" /> },
};

export const Types: Story = {
  args: {
    ...Base.args,
  },
  render: ({ ...args }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <IconButton {...args} variant="solid" />
      <IconButton {...args} variant="outline" />
      <IconButton {...args} variant="ghost" />
    </div>
  ),
};

export const Active: Story = {
  args: {
    ...Base.args,
    active: true,
  },
  render: ({ ...args }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <IconButton {...args} variant="solid" />
      <IconButton {...args} variant="outline" />
      <IconButton {...args} variant="ghost" />
    </div>
  ),
};

export const Sizes: Story = {
  args: {
    ...Base.args,
    variant: 'solid',
  },
  render: ({ ...args }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <IconButton {...args} size="small" />
      <IconButton {...args} size="medium" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    ...Base.args,
    disabled: true,
  },
  render: ({ ...args }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <IconButton {...args} variant="solid" />
      <IconButton {...args} variant="outline" />
      <IconButton {...args} variant="ghost" />
    </div>
  ),
};

export const Animated: Story = {
  args: {
    ...Base.args,
  },
  render: ({ ...args }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <IconButton {...args} onClickAnimation="glow" />
      <IconButton {...args} onClickAnimation="rotate360" />
      <IconButton {...args} onClickAnimation="jiggle" />
    </div>
  ),
};

export const WithHref: Story = {
  args: {
    ...Base.args,
  },
  render: ({ ...args }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <IconButton {...args} onClick={() => console.log('Hello')} />
      <IconButton {...args} as="a" href="https://storybook.js.org/" />
    </div>
  ),
};

export const WithText: Story = {
  args: {
    ...Base.args,
    children: (
      <>
        <Icons icon="circlehollow" />
        &nbsp;Howdy!
      </>
    ),
  },
  render: ({ ...args }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <IconButton {...args} variant="solid" />
      <IconButton {...args} variant="outline" />
      <IconButton {...args} variant="ghost" />
    </div>
  ),
};

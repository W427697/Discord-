import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Icon } from '@storybook/components/experimental';
import { Link } from './Link';

const meta: Meta<typeof Link> = {
  title: 'Link',
  component: Link,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Base = {
  args: { children: 'Link' },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Link href="https://storybook.js.org/" variant="primary">
        Primary
      </Link>
      <Link href="https://storybook.js.org/" variant="secondary">
        Secondary
      </Link>
      <Link href="https://storybook.js.org/" variant="tertiary">
        Tertiary
      </Link>
    </div>
  ),
};

export const Active: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Link href="https://storybook.js.org/" variant="primary" active>
        Primary
      </Link>
      <Link href="https://storybook.js.org/" variant="secondary" active>
        Secondary
      </Link>
      <Link href="https://storybook.js.org/" variant="tertiary" active>
        Tertiary
      </Link>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Link href="https://storybook.js.org/" variant="primary" icon={<Icon.Faceneutral />}>
        Primary
      </Link>
      <Link href="https://storybook.js.org/" variant="secondary" icon={<Icon.Faceneutral />}>
        Secondary
      </Link>
      <Link href="https://storybook.js.org/" variant="tertiary" icon={<Icon.Faceneutral />}>
        Tertiary
      </Link>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Link href="https://storybook.js.org/" size="small" icon={<Icon.Faceneutral />}>
        Small Link
      </Link>
      <Link href="https://storybook.js.org/" size="medium" icon={<Icon.Faceneutral />}>
        Medium Link
      </Link>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Link',
  },
};

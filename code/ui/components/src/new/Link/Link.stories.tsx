import type { Meta, StoryObj } from '@storybook/react';
import React, { Suspense } from 'react';

import { Icon } from '@storybook/components/experimental';
import { Link } from './Link';
import { FakeIcon } from '../FakeIcon';

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
      <Link
        href="https://storybook.js.org/"
        variant="primary"
        icon={
          <Suspense fallback={<div>Loading</div>}>
            <Icon.Faceneutral />
          </Suspense>
        }
      >
        Primary
      </Link>
      <Link href="https://storybook.js.org/" variant="secondary" icon={<FakeIcon />}>
        Secondary
      </Link>
      <Link href="https://storybook.js.org/" variant="tertiary" icon={<FakeIcon />}>
        Tertiary
      </Link>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Link href="https://storybook.js.org/" size="small" icon={<FakeIcon />}>
        Small Link
      </Link>
      <Link href="https://storybook.js.org/" size="medium" icon={<FakeIcon />}>
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

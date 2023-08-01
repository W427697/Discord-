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

export const WithIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Link href="https://storybook.js.org/" variant="primary" icon={<Icon.FaceHappy />}>
        Primary
      </Link>
      <Link href="https://storybook.js.org/" variant="secondary" icon={<Icon.FaceHappy />}>
        Secondary
      </Link>
      <Link href="https://storybook.js.org/" variant="tertiary" icon={<Icon.FaceHappy />}>
        Tertiary
      </Link>
    </div>
  ),
};

export const WithArrow: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href="https://storybook.js.org/" variant="primary" withArrow>
          Primary
        </Link>
        <Link href="https://storybook.js.org/" variant="secondary" withArrow>
          Secondary
        </Link>
        <Link href="https://storybook.js.org/" variant="tertiary" withArrow>
          Tertiary
        </Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link
          href="https://storybook.js.org/"
          variant="primary"
          icon={<Icon.FaceHappy />}
          withArrow
        >
          Primary
        </Link>
        <Link
          href="https://storybook.js.org/"
          variant="secondary"
          icon={<Icon.FaceHappy />}
          withArrow
        >
          Secondary
        </Link>
        <Link
          href="https://storybook.js.org/"
          variant="tertiary"
          icon={<Icon.FaceHappy />}
          withArrow
        >
          Tertiary
        </Link>
      </div>
    </div>
  ),
};

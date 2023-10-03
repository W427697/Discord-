import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import React from 'react';
import { Button } from './Button';
import { Icons } from '../icon/icon';

const meta = {
  title: 'Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Button' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const Row = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>{children}</div>
);

const Line = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>{children}</div>
);

export const Base: Story = {};

export const Variants: Story = {
  render: (args) => (
    <Row>
      <Line>
        <Button variant="solid" {...args}>
          Solid
        </Button>
        <Button variant="outline" {...args}>
          Outline
        </Button>
        <Button variant="ghost" {...args}>
          Ghost
        </Button>
      </Line>
      <Line>
        <Button variant="solid" {...args}>
          <Icons icon="facehappy" /> Solid
        </Button>
        <Button variant="outline" {...args}>
          <Icons icon="facehappy" /> Outline
        </Button>
        <Button variant="ghost" {...args}>
          <Icons icon="facehappy" /> Ghost
        </Button>
      </Line>
      <Line>
        <Button variant="solid" padding="small" {...args}>
          <Icons icon="facehappy" />
        </Button>
        <Button variant="outline" padding="small" {...args}>
          <Icons icon="facehappy" />
        </Button>
        <Button variant="ghost" padding="small" {...args}>
          <Icons icon="facehappy" />
        </Button>
      </Line>
    </Row>
  ),
};

export const Active: Story = {
  args: { active: true },
  render: (args) => (Variants.render as any)({ ...args }),
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Icons icon="facehappy" />
        Button
      </>
    ),
  },
  render: (props) => (
    <Line>
      <Button variant="solid" {...props} />
      <Button variant="outline" {...props} />
      <Button variant="ghost" {...props} />
    </Line>
  ),
};

export const IconOnly: Story = {
  args: {
    children: <Icons icon="facehappy" />,
    padding: 'small',
  },
  render: (props) => (
    <Line>
      <Button variant="solid" {...props} />
      <Button variant="outline" {...props} />
      <Button variant="ghost" {...props} />
    </Line>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Line>
      <Button size="small">Small Button</Button>
      <Button size="medium">Medium Button</Button>
    </Line>
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
    <Line>
      <Button onClick={() => console.log('Hello')}>I am a button using onClick</Button>
      <Button asChild>
        <a href="https://storybook.js.org/">I am an anchor using Href</a>
      </Button>
    </Line>
  ),
};

export const Animated: Story = {
  args: {
    variant: 'outline',
  },
  render: (args) => (
    <Row>
      <Line>
        <Button animation="glow" {...args}>
          Button
        </Button>
        <Button animation="jiggle" {...args}>
          Button
        </Button>
        <Button animation="rotate360" {...args}>
          Button
        </Button>
      </Line>
      <Line>
        <Button animation="glow" {...args}>
          <Icons icon="facehappy" /> Button
        </Button>
        <Button animation="jiggle" {...args}>
          <Icons icon="facehappy" /> Button
        </Button>
        <Button animation="rotate360" {...args}>
          <Icons icon="facehappy" /> Button
        </Button>
      </Line>
      <Line>
        <Button animation="glow" padding="small" {...args}>
          <Icons icon="facehappy" />
        </Button>
        <Button animation="jiggle" padding="small" {...args}>
          <Icons icon="facehappy" />
        </Button>
        <Button animation="rotate360" padding="small" {...args}>
          <Icons icon="facehappy" />
        </Button>
      </Line>
    </Row>
  ),
};

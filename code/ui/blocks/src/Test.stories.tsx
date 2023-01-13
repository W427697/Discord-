import type { FC } from 'react';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

type ButtonProps = { label: string };
const Button: FC<ButtonProps> = () => <div />;

type ExtendedProps = ButtonProps & { foo: string };

const meta: Meta<ExtendedProps> = {
  component: Button,
  render: ({ foo, ...args }) => {
    // do something with foo

    return <Button {...args} />;
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const X: Story = {
  args: {
    foo: 'bar',
  },
};

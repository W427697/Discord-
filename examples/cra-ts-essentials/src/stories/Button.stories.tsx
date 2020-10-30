import React from 'react';
import { Story, Meta } from '@storybook/react';

import { Button, ButtonProps } from './Button';

export default {
  title: 'Example/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
    label: { defaultValue: 'Button' },
  },
} as Meta;

const ArgsFirstTemplate: Story<ButtonProps> = (args) => <Button {...args} />;

export const Primary = ArgsFirstTemplate.bind({});
Primary.args = {
  children: 'foo',
  size: 'large',
};
Primary.decorators = [];

const ContextTemplate: Story<ButtonProps> = ({ args }) => <Button {...args} />;

export const Secondary = ContextTemplate.bind({});
Secondary.parameters = {
  passArgsFirst: false,
};
Secondary.args = {
  children: 'bar',
  primary: false,
};

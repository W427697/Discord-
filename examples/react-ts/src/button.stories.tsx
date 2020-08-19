import React from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';
import { Button, ButtonProps } from './button';

export default { component: Button, title: 'Examples / Button' } as Meta;

export const WithArgs: Story<ButtonProps> = (args) => <Button {...args} />;
WithArgs.args = { label: 'With args', backgroundColor: '#FAFAFA' };
WithArgs.argTypes = { backgroundColor: { control: 'color' } };
export const Basic = () => <Button label="Click me" />;

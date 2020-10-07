import React from 'react';
import Button from '../components/TsButton';

export default {
  title: 'Addons/Controls',
  component: Button,
  argTypes: {
    children: { control: 'text', name: 'Children' },
    type: { control: 'text', name: 'Type' },
    somethingElse: { control: 'object', name: 'Something Else' },
  },
};

const DEFAULT_NESTED_OBJECT = { a: 4, b: { c: 'hello', d: [1, 2, 3] } };

const Template = (args) => <Button {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: 'basic',
  somethingElse: DEFAULT_NESTED_OBJECT,
};

export const Action = Template.bind({});
Action.args = {
  children: 'hmmm',
  type: 'action',
  somethingElse: DEFAULT_NESTED_OBJECT,
};

export const CustomControls = Template.bind({});
CustomControls.args = {
  children: 'hmmm',
  type: 'action',
  somethingElse: DEFAULT_NESTED_OBJECT,
};

CustomControls.argTypes = {
  children: { table: { disable: true } },
  type: { control: { disable: true } },
  somethingElse: {
    control: {
      type: 'object',
      collapsed: true,
      displayObjectSize: false,
      displayDataTypes: false,
      // See src/controls/types:ObjectConfig for all options
    },
  },
};

export const NoArgs = () => <Button>no args</Button>;

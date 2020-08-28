import { hbs } from 'ember-cli-htmlbars';
// You don't need the css import in your own components
import './button.css';

export default {
  title: 'Example/Button',
  argTypes: {
    label: { control: 'text' },
    primary: { control: 'boolean' },
    backgroundColor: { control: 'color' },
    size: {
      control: { type: 'select', options: ['small', 'medium', 'large'] },
    },
    onClick: { action: 'onClick' },
  },
};

const Template = (args) => ({
  template: hbs`{{storybook-button
    backgroundColor=backgroundColor
    label=label
    primary=primary
    onClick=(action onClick)
  }}`,
  context: args,
});

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Button',
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'Button',
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  label: 'Button',
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  label: 'Button',
};

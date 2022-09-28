import { userEvent, within } from '@storybook/testing-library';
import MyButton from '../Button.vue';

export default {
  title: 'Button',
  component: MyButton,
  argTypes: {
    color: { control: 'color' },
  },
};

const Template = (args) => {
  return {
    data: () => ({ args }),
    components: { MyButton },
    template: '<my-button v-bind="args" />',
  };
};

export const Rounded = Template.bind({});
Rounded.decorators = [
  (storyFn, context) => {
    return storyFn({ ...context, args: { ...context.args, label: 'Overridden args' } });
  },
];
Rounded.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('button'));
};
Rounded.args = {
  rounded: true,
  color: '#f00',
  label: 'A Button with rounded edges',
};

export const Square = Template.bind({});
Square.args = {
  rounded: false,
  color: '#00f',
  label: 'A Button with square edges',
};

export const WithDefaultRender = {
  args: {
    rounded: true,
    color: '#fba',
    label: 'Button with default render',
  },
};

import MyButton from '../Button.vue';

export default {
  title: 'Button',
  component: MyButton,
  argTypes: {
    color: { control: 'color' },
  },
};

const Template = (args, { argTypes }) => {
  return {
    props: Object.keys(argTypes),
    data() {
      return { args };
    },
    components: { MyButton },
    template: '<my-button v-bind="args" />',
  };
};

export const Rounded = Template.bind({});
Rounded.decorators = [
  (storyFn, context) => {
    return storyFn({ ...context, args: { ...context.args, label: 'Hhahaha' } });
  },
];
Rounded.args = {
  rounded: true,
  color: '#f00',
  label: 'A Button with rounded edges',
};

export const AutoRender = {
  args: {
    rounded: true,
    color: '#f00',
    label: 'A Button with rounded edges',
  },
  decorators: [
    (storyFn, context) => {
      return storyFn({ ...context, args: { ...context.args, label: 'Hhahaha' } });
    },
  ],
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

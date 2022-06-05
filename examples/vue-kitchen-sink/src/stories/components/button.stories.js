import MyButton from '../Button.vue';

export default {
  title: 'Button',
  component: MyButton,
  argTypes: {
    color: { control: 'color' },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MyButton },
  template: '<my-button :color="color" :rounded="rounded">{{label}}</my-button>',
});

export const Rounded = Template.bind({});
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

export const WithDefaultRenderAndDefaultSlot = {
  args: {
    color: 'green',
    default: 'Button with default render and default slot',
  },
};

export const WithDefaultRenderAndNamedSlot = {
  args: {
    color: 'blue',
    default: 'Button with default render and named slot',
    icon: '<svg width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="m9 18 6-6-6-6"/></svg>',
  },
};

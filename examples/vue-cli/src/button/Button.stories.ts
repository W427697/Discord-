import { Meta, Story } from '@storybook/vue/types-6-0';
import Button from './Button.vue';

export default {
  title: 'Button',
  component: Button,
  parameters: {
    controls: {
      expanded: true,
    },
  },
} as Meta;

export const ButtonWithProps: Story = (args, { argTypes }) => ({
  components: { Button },
  template: '<Button :size="size">Button text</Button>',
  props: Object.keys(argTypes),
});
ButtonWithProps.args = {
  size: 'big',
};

export const WithDefaultRender = {
  args: {
    size: 'small',
    label: 'Button with default render',
  },
};

export const WithDefaultRenderAndDefaultSlot = {
  args: {
    default: 'Button with default render and default slot',
  },
};

export const WithDefaultRenderAndNamedSlot = {
  args: {
    default: 'Button with default render and named slot',
    icon: '<svg width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="m9 18 6-6-6-6"/></svg>',
  },
};

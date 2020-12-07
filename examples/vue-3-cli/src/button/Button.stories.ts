import { version } from 'vue'
import Button from './Button.vue';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    size: { control: { type: 'select', options: ['default', 'small', 'big'] } },
  },
};

export const ButtonWithProps = (args, { argTypes }) => ({
  components: { Button },
  template: '<Button :size="size">Button text</Button>',
  props: Object.keys(argTypes),
});
ButtonWithProps.args = {
  size: 'big',
};

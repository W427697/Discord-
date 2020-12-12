import { h } from 'vue';
import Button from './Button.vue';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    size: { control: { type: 'select', options: ['default', 'small', 'big'] } },
  },
  decorators: [
    () => ({ template: '<div style="margin: 3em;"><story/></div>' }),
    // () => ({ template: '<div style="border: 1px solid red;"><story/></div>' }),
  ],
};

export const ButtonWithProps = (args: any, { argTypes }: any) => ({
  components: { Button },
  template: '<Button :size="size">Button text</Button>',
  render() {
    return h(Button, { size: this.size }, () => ['Button Text']);
  },
  props: Object.keys(argTypes),
});
ButtonWithProps.args = {
  size: 'big',
};

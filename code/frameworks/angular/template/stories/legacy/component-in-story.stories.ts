import type { Meta, StoryFn } from '@storybook/angular';
import Button from '../button.component';

export const Basic: StoryFn = (args) => ({
  component: Button,
  props: args,
});
Basic.args = {
  text: 'Hello Button',
};

export default {
  // title: 'Legacy / Component in Story',
  component: Basic,
} as Meta;

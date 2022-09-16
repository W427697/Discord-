import type { Meta, StoryFn } from '@storybook/angular';
import Button from '../button.component';

export default {
  title: 'Legacy / Component in Story',
} as Meta;

export const Basic: StoryFn = (args) => ({
  component: Button,
  props: args,
});
Basic.args = {
  text: 'Hello Button',
};

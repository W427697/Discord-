import type { StoryObj } from '@storybook/vue3';
import Button from './Button.vue';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/vue/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Example/Button',
  component: Button,
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    backgroundColor: { control: 'color' },
  },
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/7.0/vue/writing-docs/docs-page
  tags: ['docsPage'],
};
type Story = StoryObj<typeof Button>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/vue/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  args: {
    primary: true,
    label: ' 👍😍 Button 😍👍 ',
  },
};

export const Secondary: Story = {
  args: {
    label: ' 👍😍 Button 😍👍 ',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    label: ' 👍😍 Button 😍👍 ',
  },
};
export const Small: Story = {
  args: {
    size: 'small',
    label: ' 👍😍 Button 😍👍 ',
  },
};

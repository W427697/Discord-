import type { StoryObj } from '@storybook/vue3';
import Header from './Header.vue';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/vue/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Example/Header',
  component: Header,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/7.0/vue/writing-docs/docs-page
  tags: ['autodocs'],
};
type Story = StoryObj<typeof Header>;
export const LoggedIn: Story = {
  name: 'Logged In',
  render: (args: any) => ({
    components: { Header },
    setup() {
      return { args };
    },
    template: '<Header :user="args.user" />',
  }),
  args: {
    user: {
      name: 'Jane Doe',
    },
  },
};

export const LoggedOut: Story = {
  args: {
    user: undefined,
  },
};

import { Story, Meta } from '@storybook/angular';
import { linkTo } from '@storybook/addon-links';
import { Welcome } from './angular-demo';

export default {
  title: 'Welcome/ To Storybook',
} as Meta;

export const ToStorybook: Story = () => ({
  component: Welcome,
  props: {
    showApp: linkTo('Button'),
  },
});

import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Button from './button.svelte';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    text: { control: 'text' },
  },
};

const Template = ({ onClick, ...args }) => ({
  Component: Button,
  props: args,
  on: {
    click: onClick,
  },
});

export const Text = Template.bind({});
Text.args = {
  text: 'Button',
  onClick: action('onClick'),
};

export const Emoji = Template.bind({});
Emoji.args = {
  text: '😀 😎 👍 💯',
};

export const WithCustomBackground = Template.bind({});
WithCustomBackground.args = {
  text: 'Defined via addon-backgrounds!',
};

WithCustomBackground.storyName = 'With custom background';

WithCustomBackground.parameters = {
  backgrounds: {
    default: 'dark',
  },
};

export const TextWithAction = () => ({
  Component: Button,
  props: {
    text: 'Trigger Action',
  },
  on: {
    click: () => action('This was clicked')(),
  },
});

TextWithAction.storyName = 'With an action';

export const ButtonWithLinkToAnotherStory = () => ({
  Component: Button,
  props: {
    text: 'Go to Welcome Story',
  },
  on: {
    click: linkTo('example-introduction--page'),
  },
});

ButtonWithLinkToAnotherStory.storyName = 'button with link to another story';

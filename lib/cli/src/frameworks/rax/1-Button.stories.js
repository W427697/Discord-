import { createElement } from 'rax';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import RaxText from 'rax-text';

export default {
  title: 'Button',
  argTypes: {
    children: { control: 'text' },
  },
};

const Template = ({ children, ...args }) => (
  <button type="button" {...args}>
    <RaxText>{children}</RaxText>
  </button>
);

export const Text = Template.bind({});
Text.args = {
  children: 'Button',
  onClick: action('onClick'),
};

export const Emoji = Template.bind({});
Emoji.args = {
  children: '😀 😎 👍 💯',
};

export const WithCustomBackground = Template.bind({});
WithCustomBackground.args = {
  children: 'Defined via addon-backgrounds!',
};

WithCustomBackground.storyName = 'With custom background';

WithCustomBackground.parameters = {
  backgrounds: {
    default: 'dark',
  },
};

export const TextWithAction = () => (
  <button onClick={() => action('This was clicked')()} type="button">
    <RaxText>Trigger Action</RaxText>
  </button>
);

TextWithAction.storyName = 'With an action';

export const ButtonWithLinkToAnotherStory = () => (
  <button onClick={linkTo('example-introduction--page')} type="button">
    <RaxText>Go to Welcome Story</RaxText>
  </button>
);

ButtonWithLinkToAnotherStory.storyName = 'button with link to another story';

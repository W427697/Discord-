import { html } from 'lit-html';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

export default {
  title: 'Button',
  argTypes: {
    children: { control: 'text' },
  },
};

const Template = ({ onClick, children }) => html`
  <button @click=${onClick}>
    ${children}
  </button>
`;

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

export const TextWithAction = () => html`
  <button @click=${() => action('This was clicked')()}>
    Trigger Action
  </button>
`;

TextWithAction.storyName = 'With an action';

export const ButtonWithLinkToAnotherStory = () => html`<button
  @click=${linkTo('example-introduction--page')}
>
  Go to Welcome Story
</button>`;

ButtonWithLinkToAnotherStory.storyName = 'button with link to another story';

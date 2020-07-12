import { hbs } from 'ember-cli-htmlbars';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

export default {
  title: 'Button',
  argTypes: {
    children: { control: 'text' },
  },
};

const Template = (args) => ({
  template: hbs`<button {{action onClick}}>{{children}}</button>`,
  context: args,
});

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

export const TextWithAction = () => ({
  template: hbs`
    <button {{action onClick}}>
      Trigger Action
    </button>
  `,
  context: {
    onClick: () => action('This was clicked')(),
  },
});

TextWithAction.storyName = 'With an action';

export const ButtonWithLinkToAnotherStory = () => ({
  template: hbs`
    <button {{action onClick}}>
      Go to Welcome Story
    </button>
  `,
  context: {
    onClick: linkTo('example-introduction--page'),
  },
});

ButtonWithLinkToAnotherStory.storyName = 'button with link to another story';

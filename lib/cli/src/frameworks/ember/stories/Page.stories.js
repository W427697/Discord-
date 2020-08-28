import { hbs } from 'ember-cli-htmlbars';
import * as HeaderStories from './Header.stories';
// You don't need the css import in your own components
import './page.css';

export default {
  title: 'Example/Page',
  argTypes: {
    onLogin: { action: 'onLogin' },
    onLogout: { action: 'onLogout' },
    onCreateAccount: { action: 'onCreateAccount' },
  },
};

const Template = (args) => ({
  template: hbs`{{storybook-page
    user=user
    onLogin=(action onLogin)
    onLogout=(action onLogout)
    onCreateAccount=(action onCreateAccount)
  }}`,
  context: args,
});

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  ...HeaderStories.LoggedIn.args,
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {
  ...HeaderStories.LoggedOut.args,
};

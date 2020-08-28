import { hbs } from 'ember-cli-htmlbars';
// You don't need the css import in your own components
import './header.css';

export default {
  title: 'Example/Header',
  argTypes: {
    onLogin: { action: 'onLogin' },
    onLogout: { action: 'onLogout' },
    onCreateAccount: { action: 'onCreateAccount' },
  },
};

const Template = (args) => ({
  template: hbs`{{storybook-header
    user=user
    onLogin=(action onLogin)
    onLogout=(action onLogout)
    onCreateAccount=(action onCreateAccount)
  }}`,
  context: args,
});

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  user: {},
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {};

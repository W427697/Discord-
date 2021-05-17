import { html } from 'lit';
import * as HeaderStories from './sb-header.stories';

import './sb-page.js';

export default {
  title: 'Example/Page',
};

const Template = ({ user }) => html`<sb-page user="${user}"></sb-page>`;

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  ...HeaderStories.LoggedIn.args,
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {
  ...HeaderStories.LoggedOut.args,
};

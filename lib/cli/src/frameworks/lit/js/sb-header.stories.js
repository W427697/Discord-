import { html } from 'lit';

import './sb-header.js';

export default {
  title: 'Example/Header',
};

const Template = ({ user }) => html`<sb-header .user="${user}"></sb-header>`;

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  user: {},
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {};

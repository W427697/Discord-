import { Header } from './Header';

export default {
  title: 'Example/Header',
  render: (args) => Header(args),
};

export const LoggedIn = {
  args: {
    user: {
      name: 'Jane Doe',
    },
  },
};

export const LoggedOut = {};

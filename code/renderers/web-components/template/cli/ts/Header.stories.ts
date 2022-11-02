import type { Meta, StoryObj } from '@storybook/web-components';
import type { HeaderProps } from './Header';
import { Header } from './Header';

const meta: Meta<HeaderProps> = {
  title: 'Example/Header',
  render: (args) => Header(args),
};

export default meta;
type Story = StoryObj<HeaderProps>;

export const LoggedIn: Story = {
  args: {
    user: {
      name: 'Jonh Doe',
    },
  },
};

export const LoggedOut: Story = {};

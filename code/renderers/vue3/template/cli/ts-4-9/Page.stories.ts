import type { Meta, StoryObj } from '@storybook/vue3';
import { within, userEvent, expect } from '@storybook/test';
import MyPage from './Page.vue';

const meta = {
  title: 'Example/Page',
  component: MyPage,
  render: () => ({
    components: { MyPage },
    template: '<my-page />',
  }),
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MyPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on interaction testing: https://storybook.js.org/docs/vue/writing-tests/interaction-testing
export const LoggedIn: Story = {
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const loginButton = canvas.getByRole('button', { name: /Log in/i });
    await expect(loginButton).toBeInTheDocument();
    await userEvent.click(loginButton);
    await expect(loginButton).not.toBeInTheDocument();

    const logoutButton = canvas.getByRole('button', { name: /Log out/i });
    await expect(logoutButton).toBeInTheDocument();
  },
};

export const LoggedOut: Story = {};

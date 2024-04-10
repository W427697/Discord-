import type { Meta } from '@storybook/react';
import type { StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { cookies, headers } from '@storybook/nextjs/headers.mock';
import NextHeader from './NextHeader';

export default {
  component: NextHeader,
} as Meta<typeof NextHeader>;

type Story = StoryObj<typeof NextHeader>;

export const Default: Story = {
  loaders: async () => {
    cookies().set('firstName', 'Jane');
    cookies().set({
      name: 'lastName',
      value: 'Doe',
    });
    headers().set('timezone', 'Central European Summer Time');
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submitButton = await canvas.findByRole('button');
    await userEvent.click(submitButton);
    expect(headers().get('cookie')).toContain('user-id=encrypted-id');
  },
};

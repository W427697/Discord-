import type { Meta } from '@storybook/react';
import { StoryObj } from '@storybook/react/src';
import { userEvent, within } from '@storybook/testing-library';
import React from 'react';
import { Page } from './Page';

const meta: Meta<typeof Page> = {
  title: 'Example/Page',
  component: Page,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
};

export default meta;

export const LoggedOut: StoryObj<typeof Page> = {};

export const LoggedIn: StoryObj<typeof Page> = {
  // More on interaction testing: https://storybook.js.org/docs/react/writing-tests/interaction-testing
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loginButton = await canvas.getByRole('button', { name: /Log in/i });
    await userEvent.click(loginButton);
  },
};

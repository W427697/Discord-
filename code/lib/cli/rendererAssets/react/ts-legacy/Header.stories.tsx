import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Header } from './Header';

const meta: Meta<typeof Header> = {
  title: 'Example/Header',
  component: Header,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
};

export default meta;

export const LoggedIn: StoryObj<typeof Header> = {
  args: {
    user: { name: 'Jane Doe' },
  },
};

export const LoggedOut: StoryObj<typeof Header> = {};

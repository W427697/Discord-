import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Header } from './Header';

const meta = {
  title: 'Example/Header',
  component: Header,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedIn = {
  args: {
    user: { name: 'Jane Doe' },
  },
} satisfies Story;

export const LoggedOut = {} satisfies Story;

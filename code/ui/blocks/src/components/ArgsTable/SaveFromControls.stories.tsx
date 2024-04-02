import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { SaveFromControls } from './SaveFromControls';
import { expect, fn, userEvent, within } from '@storybook/test';

const meta = {
  component: SaveFromControls,
  title: 'Components/ArgsTable/SaveFromControls',
  args: {
    saveStory: fn(action('saveStory')),
    createStory: fn(action('createStory')),
    resetArgs: fn(action('resetArgs')),
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SaveFromControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Creating: Story = {
  play: async ({ canvasElement }) => {
    const createButton = await within(canvasElement).findByRole('button', { name: /create/i });
    await userEvent.click(createButton);
  },
};

export const Created: Story = {
  play: async (context) => {
    await Creating.play(context);
    const { canvasElement, args } = context;

    const input = await within(canvasElement).findByRole('textbox');
    await userEvent.type(input, 'MyNewStory');
    const submitButton = await within(canvasElement).findByRole('button', { name: /save/i });
    await userEvent.click(submitButton);

    await expect(args.createStory).toHaveBeenCalledWith('MyNewStory');
  },
};

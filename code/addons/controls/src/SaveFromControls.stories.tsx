import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { SaveFromControls } from './SaveFromControls';
import { expect, fireEvent, fn, userEvent, waitFor, within } from '@storybook/test';

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

export const Creating = {
  play: async ({ canvasElement }) => {
    const createButton = await within(canvasElement).findByRole('button', { name: /Create/i });
    await fireEvent.click(createButton);
  },
} satisfies Story;

export const Created: Story = {
  play: async (context) => {
    await Creating.play(context);

    await waitFor(async () => {
      const dialog = await within(document.body).findByRole('dialog');
      const input = await within(dialog).findByRole('textbox');
      await userEvent.type(input, 'MyNewStory');
      const submitButton = await within(dialog).findByRole('button', { name: /Create/i });
      await userEvent.click(submitButton);
    });

    await expect(context.args.createStory).toHaveBeenCalledWith('MyNewStory');
  },
};

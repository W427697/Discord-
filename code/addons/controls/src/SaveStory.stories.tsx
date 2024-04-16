import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { SaveStory } from './SaveStory';
import { expect, fireEvent, fn, userEvent, waitFor, within } from '@storybook/test';

const meta = {
  component: SaveStory,
  args: {
    saveStory: (...args) => Promise.resolve(fn(action('saveStory'))(...args)),
    createStory: (...args) => Promise.resolve(fn(action('createStory'))(...args)),
    resetArgs: fn(action('resetArgs')),
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SaveStory>;

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

export const CreatingFailed: Story = {
  args: {
    // eslint-disable-next-line local-rules/no-uncategorized-errors
    createStory: () => Promise.reject<any>(new Error('Story already exists.')),
  },
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

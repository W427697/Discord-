import { expect } from '@storybook/jest';
import { global as globalThis } from '@storybook/global';
import { within, userEvent } from '@storybook/testing-library';
import { UPDATE_STORY_ARGS } from '@storybook/core-events';
import ReactiveArgs from './ReactiveArgs.vue';

export default {
  component: ReactiveArgs,
  argTypes: {
    // To show that other props are passed through
    backgroundColor: { control: 'color' },
  },
};

export const Reactive = {
  args: {
    label: 'Button',
  },
  // test that args are updated correctly in rective mode
  play: async ({ canvasElement, id }) => {
    const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;
    const canvas = within(canvasElement);
    const reactiveButton = await canvas.getByRole('button');
    await expect(reactiveButton).toHaveTextContent('Button 0');

    await userEvent.click(reactiveButton); // click to update the label to increment the count + 1
    await channel.emit(UPDATE_STORY_ARGS, {
      storyId: id,
      updatedArgs: { label: 'updated' },
    });
    await expect(reactiveButton).toHaveTextContent('updated 1');

    await userEvent.click(reactiveButton); // click to update the label to increment the count + 1
    await expect(reactiveButton).toHaveTextContent('updated 2');

    await channel.emit(UPDATE_STORY_ARGS, {
      storyId: id,
      updatedArgs: { label: 'updated again' },
    });
    expect(reactiveButton).toHaveTextContent('updated again 2');
  },
};

import { expect } from '@junk-temporary-prototypes/jest';
import { global as globalThis } from '@junk-temporary-prototypes/global';
import { within, userEvent } from '@junk-temporary-prototypes/testing-library';
import { UPDATE_STORY_ARGS, STORY_ARGS_UPDATED, RESET_STORY_ARGS } from '@junk-temporary-prototypes/core-events';
import ReactiveArgs from './ReactiveArgs.vue';

export default {
  component: ReactiveArgs,
  argTypes: {
    // To show that other props are passed through
    backgroundColor: { control: 'color' },
  },
};

export const ReactiveTest = {
  args: {
    label: 'Button',
  },
  // test that args are updated correctly in rective mode
  play: async ({ canvasElement, id }) => {
    const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;
    const canvas = within(canvasElement);

    await channel.emit(RESET_STORY_ARGS, { storyId: id });
    await new Promise((resolve) => {
      channel.once(STORY_ARGS_UPDATED, resolve);
    });
    const reactiveButton = await canvas.getByRole('button');
    await expect(reactiveButton).toHaveTextContent('Button 0');

    await userEvent.click(reactiveButton); // click to update the label to increment the count + 1
    await channel.emit(UPDATE_STORY_ARGS, {
      storyId: id,
      updatedArgs: { label: 'updated' },
    });
    await new Promise((resolve) => {
      channel.once(STORY_ARGS_UPDATED, resolve);
    });
    await expect(canvas.getByRole('button')).toHaveTextContent('updated 1');

    await userEvent.click(reactiveButton); // click to update the label to increment the count + 1
    await expect(reactiveButton).toHaveTextContent('updated 2');
  },
};

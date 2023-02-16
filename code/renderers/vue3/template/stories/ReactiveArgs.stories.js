import { expect } from '@storybook/jest';
import { global as globalThis } from '@storybook/global';
import { within, userEvent } from '@storybook/testing-library';
import { UPDATE_STORY_ARGS, STORY_ARGS_UPDATED, RESET_STORY_ARGS } from '@storybook/core-events';
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

export const DecoratedReactive = {
  components: { ReactiveArgs },
  args: { ...ReactiveTest.args },
  decorators: [
    () => ({
      template: `
        <div style="border: 5px solid red;">
          <story/>
        </div>
        `,
    }),
  ],
  play: ReactiveTest.play,
};

// test reactive args story for CSF2
export const ReactiveCSF2 = (args) => ({
  components: { ReactiveArgs },
  template: '<ReactiveArgs v-bind="$props" />',
});
ReactiveCSF2.args = ReactiveTest.args;
ReactiveCSF2.play = ReactiveTest.play;

// test reactive args story with decorator CSF2
export const DecoratedReactiveCSF2 = (args) => ({
  components: { ReactiveArgs },
  template: '<ReactiveArgs v-bind="$props" />',
});
DecoratedReactiveCSF2.args = ReactiveTest.args;
DecoratedReactiveCSF2.play = ReactiveTest.play;
DecoratedReactiveCSF2.decorators = DecoratedReactive.decorators;

import { expect } from '@storybook/jest';
import { global as globalThis } from '@storybook/global';
import type { Meta, StoryObj, StoryFn } from '@storybook/vue3';
import { within, userEvent } from '@storybook/testing-library';
import { UPDATE_STORY_ARGS, STORY_ARGS_UPDATED, RESET_STORY_ARGS } from '@storybook/core-events';

import ReactiveArgs from './ReactiveArgs.vue';

const meta = {
  component: ReactiveArgs,
  argTypes: {
    // To show that other props are passed through
    backgroundColor: { control: 'color' },
  },
} satisfies Meta<typeof ReactiveArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ReactiveTest: Story = {
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

export const ReactiveHtmlWrapper: Story = {
  args: { label: 'Wrapped Button' },

  decorators: [
    () => ({
      template: `
        <div style="border: 5px solid red;">
          <story/>
        </div>
        `,
    }),
  ],
  play: async ({ canvasElement, id }) => {
    const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;
    const canvas = within(canvasElement);

    await channel.emit(RESET_STORY_ARGS, { storyId: id });
    await new Promise((resolve) => {
      channel.once(STORY_ARGS_UPDATED, resolve);
    });
    await expect(canvas.getByTestId('header-slot').innerText).toContain(
      'Header title from the slot'
    );
    await expect(canvas.getByTestId('default-slot').innerText).toContain('Default Text Slot');
    await expect(canvas.getByTestId('footer-slot').innerText).toContain('Footer VNode Slot');

    await channel.emit(UPDATE_STORY_ARGS, {
      storyId: id,
      updatedArgs: {
        default: () => 'Default Text Slot Updated',
        footer: () => h('p', 'Footer VNode Slot Updated'),
      },
    });
    await new Promise((resolve) => {
      channel.once(STORY_ARGS_UPDATED, resolve);
    });
    await expect(canvas.getByTestId('default-slot').innerText).toContain(
      'Default Text Slot Updated'
    );
    await expect(canvas.getByTestId('footer-slot').innerText).toContain(
      'Footer VNode Slot Updated'
    );
  },
};

// to test that Simple html Decorators in CSF2 format are applied correctly in reactive mode
const ReactiveCSF2WrapperTempl: StoryFn = (args) => ({
  components: { ReactiveArgs },
  setup() {
    return { args };
  },
  template: '<ReactiveArgs v-bind="args" />',
});

export const ReactiveCSF2Wrapper = ReactiveCSF2WrapperTempl.bind({});

ReactiveCSF2Wrapper.args = {
  label: 'CSF2 Wrapped Button',
};
ReactiveCSF2Wrapper.decorators = [
  () => ({
    template: `
      <div style="border: 5px solid red;">
        <story/>
      </div>
      `,
  }),
];

ReactiveCSF2Wrapper.play = async ({ canvasElement, id }) => {
  const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;
  const canvas = within(canvasElement);

  await channel.emit(RESET_STORY_ARGS, { storyId: id });
  await new Promise((resolve) => {
    channel.once(STORY_ARGS_UPDATED, resolve);
  });
  const reactiveButton = await canvas.getByRole('button');
  await expect(reactiveButton).toHaveTextContent('CSF2 Wrapped Button 0');

  await userEvent.click(reactiveButton); // click to update the label to increment the count + 1
  await channel.emit(UPDATE_STORY_ARGS, {
    storyId: id,
    updatedArgs: { label: 'updated CSF2 Wrapped Button' },
  });
  await new Promise((resolve) => {
    channel.once(STORY_ARGS_UPDATED, resolve);
  });
  await expect(canvas.getByRole('button')).toHaveTextContent('updated CSF2 Wrapped Button 1');

  await userEvent.click(reactiveButton); // click to update the label to increment the count + 1
  await expect(reactiveButton).toHaveTextContent('updated CSF2 Wrapped Button 2');
};

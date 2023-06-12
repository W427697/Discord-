import type { Meta, StoryFn } from '@storybook/vue3';

import { h } from 'vue';
import type { PlayFunctionContext } from '@storybook/types';
import { RESET_STORY_ARGS, STORY_ARGS_UPDATED, UPDATE_STORY_ARGS } from '@storybook/core-events';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import Button from './Button.vue';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/vue/writing-stories/introduction
const meta = {
  title: 'CSF2/Button',
  component: Button,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/7.0/vue/writing-docs/docs-page
  tags: ['autodocs'],
  play: async ({ id, canvasElement }: PlayFunctionContext<any>) => {
    const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;
    await channel.emit(RESET_STORY_ARGS, { storyId: id });
    await new Promise((resolve) => channel.once(STORY_ARGS_UPDATED, resolve));
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button').textContent).toEqual('CSF2 Button');

    await channel.emit(UPDATE_STORY_ARGS, {
      storyId: id,
      updatedArgs: { label: 'updated' },
    });
    await new Promise((resolve) => channel.once(STORY_ARGS_UPDATED, resolve));
    await expect(canvas.getByRole('button').textContent).toEqual('updated');
  },
} satisfies Meta<typeof Button>;

export default meta;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/vue/api/csf
 * to learn how to use render functions.
 */

type CSF2Story = StoryFn<typeof Button>;

export const CSF2Button: CSF2Story = (args, { argTypes }) => ({
  components: { Button },
  props: Object.keys(argTypes),
  template: '<Button v-bind="$props" ></Button>',
});

CSF2Button.args = {
  label: 'CSF2 Button',
};

export const CSF2WithDecorator: CSF2Story = (args, { argTypes }) => ({
  components: { Button },
  props: Object.keys(argTypes),
  template: '<Button v-bind="$props" ></Button>',
});
CSF2WithDecorator.args = {
  label: 'CSF2 Button',
};
CSF2WithDecorator.decorators = [
  () => ({
    template:
      '<div style="display: flex; padding: 20px; background-color: #cccc72;"><story /></div>',
  }),
];

export const CSF2ButtonWithFnDecorator: CSF2Story = (args, { argTypes }) => ({
  components: { Button },
  props: Object.keys(argTypes),
  template: '<Button v-bind="$props" ></Button>',
});
CSF2ButtonWithFnDecorator.args = {
  label: 'CSF2 Button',
};

CSF2ButtonWithFnDecorator.decorators = [
  (storyFn, context) => {
    // Call the `storyFn` to receive a component that Vue can render
    const story = storyFn();
    // Vue 3 "Functional" component as decorator
    return () => {
      return h('div', { style: 'border: 2px solid blue;padding:10px' }, h(story, context.args));
    };
  },
];

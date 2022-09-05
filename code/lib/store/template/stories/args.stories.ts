import globalThis from 'global';
import { PartialStoryFn, PlayFunctionContext, StoryContext } from '@storybook/csf';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

export default {
  component: globalThis.Components.Pre,
  args: {
    componentArg: 'componentArg',
    storyArg: 'componentStoryArg',
    object: {
      a: 'component',
      b: 'component',
    },
  },
};

export const Inheritance = {
  // Compose all the args into `object`, so the pre component only needs a single prop
  decorators: [
    (storyFn: PartialStoryFn, context: StoryContext) => storyFn({ args: { object: context.args } }),
  ],
  args: {
    storyArg: 'storyArg',
    object: {
      a: 'story',
    },
  },
  play: async ({ canvasElement }: PlayFunctionContext) => {
    // NOTE: these stories don't test project-level args inheritance as it is too problematic
    // to have an arg floating around that will apply too *all* other stories in our sandboxes.
    await expect(JSON.parse(within(canvasElement).getByTestId('pre').innerHTML)).toEqual({
      componentArg: 'componentArg',
      storyArg: 'storyArg',
      object: {
        a: 'story',
      },
    });
  },
};

export const Events = {
  // Just pass the "test" arg to the pre (ignore the component ones)
  decorators: [
    (storyFn: PartialStoryFn, context: StoryContext) =>
      storyFn({ args: { text: context.args.test } }),
  ],
  args: {
    test: 'initial',
  },
  play: async ({ canvasElement, id }: PlayFunctionContext) => {
    const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;
    await within(canvasElement).findByText('initial', {}, { timeout: 3000 });

    await channel.emit('updateStoryArgs', { storyId: id, updatedArgs: { test: 'updated' } });
    await within(canvasElement).findByText('updated', {}, { timeout: 3000 });

    await channel.emit('resetStoryArgs', { storyId: id });
    await within(canvasElement).findByText('initial', {}, { timeout: 3000 });
  },
};

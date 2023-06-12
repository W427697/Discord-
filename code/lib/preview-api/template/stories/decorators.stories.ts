import { global as globalThis } from '@storybook/global';
import type {
  ArgsStoryFn,
  PartialStoryFn,
  PlayFunctionContext,
  StoryContext,
} from '@storybook/types';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { useEffect } from '@storybook/preview-api';
import { STORY_ARGS_UPDATED, UPDATE_STORY_ARGS, RESET_STORY_ARGS } from '@storybook/core-events';

export default {
  component: globalThis.Components.Pre,
  parameters: { useProjectDecorator: true },
  decorators: [
    (storyFn: PartialStoryFn, context: StoryContext) =>
      storyFn({ args: { ...context.args, text: `component ${context.args['text']}` } }),
  ],
};

export const Inheritance = {
  decorators: [
    (storyFn: PartialStoryFn, context: StoryContext) =>
      storyFn({ args: { ...context.args, text: `story ${context.args['text']}` } }),
  ],
  args: {
    text: 'starting',
  },
  play: async ({ canvasElement }: PlayFunctionContext<any>) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('pre').innerText).toEqual('story component project starting');
  },
};

// Issue: https://github.com/storybookjs/storybook/issues/22945
export const Hooks = {
  decorators: [
    // decorator that uses hooks
    (storyFn: PartialStoryFn, context: StoryContext) => {
      useEffect(() => {});

      return storyFn({ args: { ...context.args, text: `story ${context.args['text']}` } });
    },
    // conditional decorator, runs before the above
    (storyFn: PartialStoryFn, context: StoryContext) => {
      return context.args.condition ? storyFn() : null;
    },
  ],
  args: {
    text: 'starting',
    condition: true,
  },
  play: async ({ id, canvasElement }: PlayFunctionContext<any>) => {
    const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;
    await channel.emit(RESET_STORY_ARGS, { storyId: id });
    await new Promise((resolve) => channel.once(STORY_ARGS_UPDATED, resolve));
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('pre').innerText).toEqual('story component project starting');

    await channel.emit(UPDATE_STORY_ARGS, {
      storyId: id,
      updatedArgs: { condition: false },
    });
    await new Promise((resolve) => channel.once(STORY_ARGS_UPDATED, resolve));
    await expect(canvas.getByTestId('pre').innerText).toEqual('component project starting');
  },
};

export const MultiHooks = {
  decorators: [
    // decorator A that uses hooks
    (storyFn: PartialStoryFn, context: StoryContext) => {
      useEffect(() => {});

      return storyFn({ args: { ...context.args, text: `WrapperA( ${context.args['text']} )` } });
    },
    // decorator B that uses hooks
    (storyFn: PartialStoryFn, context: StoryContext) => {
      useEffect(() => {});

      return storyFn({ args: { ...context.args, text: `WrapperB( ${context.args['text']} )` } });
    },
    // conditional decorator, runs before the above
    (storyFn: PartialStoryFn, context: StoryContext) => {
      return context.args.condition ? storyFn() : null;
    },
  ],
  args: {
    text: 'story',
    condition: true,
  },
  play: async ({ id, canvasElement }: PlayFunctionContext<any>) => {
    const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;
    await channel.emit(RESET_STORY_ARGS, { storyId: id });
    await new Promise((resolve) => channel.once(STORY_ARGS_UPDATED, resolve));
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('pre').innerText).toEqual(
      'WrapperA( WrapperB( component project story ) )'
    );

    await channel.emit(UPDATE_STORY_ARGS, {
      storyId: id,
      updatedArgs: { condition: false },
    });
    await new Promise((resolve) => channel.once(STORY_ARGS_UPDATED, resolve));
    await expect(canvas.getByTestId('pre').innerText).toEqual('component project story');
  },
};

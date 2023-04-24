import { global as globalThis } from '@storybook/global';
import type { PartialStoryFn, PlayFunctionContext, StoryContext } from '@storybook/types';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { RESET_STORY_ARGS, STORY_ARGS_UPDATED, UPDATE_STORY_ARGS } from '@storybook/core-events';

const arrows = {
  ArrowUp: { name: 'ArrowUp' },
  ArrowDown: { name: 'ArrowDown' },
  ArrowLeft: { name: 'ArrowLeft' },
  ArrowRight: { name: 'ArrowRight' },
};

export default {
  component: globalThis.Components.Pre,
  // Compose all the argTypes into `object`, so the pre component only needs a single prop
  decorators: [
    (storyFn: PartialStoryFn, context: StoryContext) => storyFn({ args: { object: context.args } }),
  ],
};

export const Single = {
  argTypes: {
    arrow: {
      options: Object.keys(arrows),
      mapping: arrows,
      control: {
        type: 'select',
        labels: {
          ArrowUp: 'Up',
          ArrowDown: 'Down',
          ArrowLeft: 'Left',
          ArrowRight: 'Right',
        },
      },
    },
  },
  play: async ({ canvasElement, id }: PlayFunctionContext<any>) => {
    const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;

    await channel.emit(RESET_STORY_ARGS, { storyId: id });
    await new Promise((resolve) => channel.once(STORY_ARGS_UPDATED, resolve));

    await channel.emit(UPDATE_STORY_ARGS, { storyId: id, updatedArgs: { arrow: 'ArrowRight' } });
    await new Promise((resolve) => channel.once(STORY_ARGS_UPDATED, resolve));
    await expect(JSON.parse(within(canvasElement).getByTestId('pre').innerText)).toMatchObject({
      arrow: { name: 'ArrowRight' },
    });

    await channel.emit(UPDATE_STORY_ARGS, { storyId: id, updatedArgs: { arrow: 'ArrowUp' } });
    await new Promise((resolve) => channel.once(STORY_ARGS_UPDATED, resolve));
    await expect(JSON.parse(within(canvasElement).getByTestId('pre').innerText)).toMatchObject({
      arrow: { name: 'ArrowUp' },
    });
  },
};

export const Multiple = {
  argTypes: {
    arrows: {
      options: Object.keys(arrows),
      mapping: arrows,
      control: {
        type: 'multi-select',
        labels: {
          ArrowUp: 'Up',
          ArrowDown: 'Down',
          ArrowLeft: 'Left',
          ArrowRight: 'Right',
        },
      },
    },
  },
  play: async ({ canvasElement, id }: PlayFunctionContext<any>) => {
    const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;

    await channel.emit(RESET_STORY_ARGS, { storyId: id });
    await new Promise((resolve) => channel.once(STORY_ARGS_UPDATED, resolve));

    await channel.emit(UPDATE_STORY_ARGS, {
      storyId: id,
      updatedArgs: { arrows: ['ArrowRight', 'ArrowLeft'] },
    });
    await new Promise((resolve) => channel.once(STORY_ARGS_UPDATED, resolve));
    await expect(JSON.parse(within(canvasElement).getByTestId('pre').innerText)).toMatchObject({
      arrows: [{ name: 'ArrowRight' }, { name: 'ArrowLeft' }],
    });

    await channel.emit(UPDATE_STORY_ARGS, {
      storyId: id,
      updatedArgs: { arrows: ['ArrowUp', 'ArrowDown'] },
    });
    await new Promise((resolve) => channel.once(STORY_ARGS_UPDATED, resolve));
    await expect(JSON.parse(within(canvasElement).getByTestId('pre').innerText)).toMatchObject({
      arrows: [{ name: 'ArrowUp' }, { name: 'ArrowDown' }],
    });
  },
};

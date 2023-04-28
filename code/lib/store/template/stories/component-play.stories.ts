import { global as globalThis } from '@junk-temporary-prototypes/global';
import type { PartialStoryFn, PlayFunctionContext, StoryContext } from '@junk-temporary-prototypes/types';
import { within } from '@junk-temporary-prototypes/testing-library';
import { expect } from '@junk-temporary-prototypes/jest';

export default {
  component: globalThis.Components.Pre,
  play: async ({ canvasElement, name }: PlayFunctionContext) => {
    await expect(JSON.parse(within(canvasElement).getByTestId('pre').innerText)).toEqual({
      name,
    });
  },
  // Render the story name into the Pre
  decorators: [
    (storyFn: PartialStoryFn, context: StoryContext) => {
      const { name } = context;
      return storyFn({ args: { object: { name } } });
    },
  ],
};

export const StoryOne = {};
export const StoryTwo = {};

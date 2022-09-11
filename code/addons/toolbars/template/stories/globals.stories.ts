import globalThis from 'global';
import { PartialStoryFn, StoryContext } from '@storybook/csf';

export default {
  component: null,
  decorators: [
    (storyFn: PartialStoryFn, context: StoryContext) =>
      storyFn({ component: globalThis.Components.Pre, args: { object: context.globals } }),
  ],
};

export const Basic = {};

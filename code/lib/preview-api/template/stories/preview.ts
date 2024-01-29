import type { PartialStoryFn, StoryContext } from '@storybook/types';

export const parameters = {
  docs: {
    source: { type: 'code' }, // Walkthrough for issue 22881 by assigning docs -> source -> type to 'code'.
    projectParameter: 'projectParameter',
    storyObject: {
      a: 'project',
      b: 'project',
      c: 'project',
    },
  },
};

export const loaders = [async () => ({ projectValue: 2 })];

export const decorators = [
  (storyFn: PartialStoryFn, context: StoryContext) => {
    if (context.parameters.useProjectDecorator)
      return storyFn({ args: { ...context.args, text: `project ${context.args.text}` } });
    return storyFn();
  },
];

export const globals = {
  foo: 'fooValue',
};

export const globalTypes = {
  foo: { defaultValue: 'fooDefaultValue' },
  bar: { defaultValue: 'barDefaultValue' },
};

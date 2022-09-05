import { PartialStoryFn, StoryContext } from '@storybook/csf';

export const parameters = {
  projectParameter: 'projectParameter',
  storyObject: {
    a: 'project',
    b: 'project',
    c: 'project',
  },
};

export const loaders = [
  async () => new Promise((r) => setTimeout(() => r({ projectValue: 2 }), 1000)),
];

export const decorators = [
  (storyFn: PartialStoryFn, context: StoryContext) => {
    if (context.parameters.useProjectDecorator)
      return storyFn({ args: { ...context.args, text: `project ${context.args.text}` } });
    return storyFn();
  },
];

import globalThis from 'global';
import { PlayFunctionContext, StoryContext } from '@storybook/csf';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

// TODO: is there some way to define a project-level annotation in sandboxes?

export default {
  component: globalThis.Components.Pre,
  parameters: {
    componentParameter: 'componentParameter',
    storyParameter: 'componentStoryParameter', // Checking this gets overridden
    storyObject: {
      a: 'component',
      b: 'component',
    },
  },
};

export const Inheritance = {
  parameters: {
    storyParameter: 'storyParameter',
    storyObject: {
      a: 'story',
    },
  },
  decorators: [
    (storyFn, context) => {
      const { projectParameter, componentParameter, storyParameter, storyObject } =
        context.parameters;
      return storyFn({
        ...context,
        args: { object: { projectParameter, componentParameter, storyParameter, storyObject } },
      });
    },
  ],
  play: async ({ canvasElement }: PlayFunctionContext) => {
    const canvas = within(canvasElement);
    await expect(JSON.parse(canvas.getByTestId('pre').innerHTML)).toEqual({
      projectParameter: 'projectParameter',
      componentParameter: 'componentParameter',
      storyParameter: 'storyParameter',
      storyObject: {
        a: 'story',
        b: 'component',
        c: 'project',
      },
    });
  },
};

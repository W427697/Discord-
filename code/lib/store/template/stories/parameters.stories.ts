import globalThis from 'global';
import { PlayFunctionContext, StoryContext } from '@storybook/csf';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

// TODO: is there some way to define a project-level annotation in sandboxes?

export default {
  component: globalThis.Components.Code,
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
  render: (_: any, context: StoryContext) => {
    const { componentParameter, storyParameter, storyObject } = context.parameters;
    return globalThis.Components.render(
      { code: JSON.stringify({ componentParameter, storyParameter, storyObject }, null, 2) },
      context
    );
  },
  play: async ({ canvasElement }: PlayFunctionContext) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('code').innerHTML).toEqual(
      JSON.stringify(
        {
          componentParameter: 'componentParameter',
          storyParameter: 'storyParameter',
          storyObject: {
            a: 'story',
            b: 'component',
          },
        },
        null,
        2
      )
    );
  },
};

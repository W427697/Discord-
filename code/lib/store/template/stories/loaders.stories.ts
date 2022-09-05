import globalThis from 'global';
import { PlayFunctionContext, StoryContext } from '@storybook/csf';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

export default {
  component: globalThis.Components.Code,
  loaders: [async () => new Promise((r) => setTimeout(() => r({ componentValue: 7 }), 3000))],
  render: (_: any, context: StoryContext) =>
    globalThis.Components.render({ code: JSON.stringify(context.loaded, null, 2) }, context),
};

export const Inheritance = {
  loaders: [async () => new Promise((r) => setTimeout(() => r({ storyValue: 3 }), 1000))],
  play: async ({ canvasElement }: PlayFunctionContext) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('code').innerHTML).toEqual(
      JSON.stringify({ componentValue: 7, storyValue: 3 }, null, 2)
    );
  },
};

export const ZIndex = {
  decorators: [
    globalThis.Components.styleDecorator({
      position: 'relative',
      zIndex: 1000,
      width: '500px',
      height: '500px',
      background: 'coral',
    }),
  ],
};

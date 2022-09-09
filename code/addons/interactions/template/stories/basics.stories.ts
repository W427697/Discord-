/* eslint-disable jest/no-standalone-expect */
import globalThis from 'global';
import { within, waitFor, fireEvent, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

export default {
  component: globalThis.Components.Form,
  argTypes: {
    onSuccess: { type: 'function' },
  },
};

export const Type = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByTestId('value'), 'test');
  },
};

export const Step = {
  play: async (context) => {
    await context.step('Enter value', async () => Type.play(context));
  },
};

export const Click = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await fireEvent.click(canvas.getByTestId('succeed'));
  },
};

export const Callback = {
  play: async (context) => {
    const { args, canvasElement, step } = context;
    const canvas = within(canvasElement);
    await step('Enter value', async () => Type.play(context));

    await step('Click checkbox', async () => Click.play(context));

    await step('Submit', async () => {
      await fireEvent.click(canvas.getByRole('button'));
    });

    await expect(args.onSuccess).toHaveBeenCalled();
  },
};

export const WaitFor = {
  play: async (context) => {
    const { args, canvasElement, step } = context;
    const canvas = within(canvasElement);
    await step('Enter value', async () => Type.play(context));

    await step('Submit', async () => {
      await fireEvent.click(canvas.getByRole('button'));
    });

    await expect(args.onSuccess).not.toHaveBeenCalled();

    await waitFor(
      async function () {
        await canvas.getByTestId("Submitted 'test' when not allowed!");
      },
      { timeout: 2000 }
    );
  },
};

export const Hover = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.hover(canvas.getByRole('button'));
  },
};

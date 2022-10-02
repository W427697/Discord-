/* eslint-disable jest/no-standalone-expect */
import globalThis from 'global';
import {
  within,
  waitFor,
  fireEvent,
  userEvent,
  waitForElementToBeRemoved,
} from '@storybook/testing-library';
import { expect } from '@storybook/jest';

export default {
  component: globalThis.Components.Form,
  argTypes: {
    onSuccess: { type: 'function' },
  },
};

// FIXME: remove this when @storybook/testing-library supports shadow DOM
const safeWithin = (canvasElement) =>
  globalThis.storybookRenderer === 'web-components'
    ? within(canvasElement.querySelector(globalThis.Components.Form).shadowRoot)
    : within(canvasElement);

export const Type = {
  play: async ({ canvasElement }) => {
    const canvas = safeWithin(canvasElement);
    await userEvent.type(canvas.getByTestId('value'), 'test');
  },
};

export const Step = {
  play: async ({ step }) => {
    await step('Enter value', Type.play);
  },
};

export const Callback = {
  play: async ({ args, canvasElement, step }) => {
    const canvas = safeWithin(canvasElement);
    await step('Enter value', Type.play);

    await step('Submit', async () => {
      await fireEvent.click(canvas.getByRole('button'));
    });

    await expect(args.onSuccess).toHaveBeenCalled();
  },
};

// NOTE: of course you can use `findByText()` to implicitly waitFor, but we want
// an explicit test here
export const SyncWaitFor = {
  play: async ({ canvasElement, step }) => {
    const canvas = safeWithin(canvasElement);
    await step('Setup', Callback.play);

    // FIXME: why doesn't this work?
    // await waitFor(() => {
    //   canvas.getByText('Completed!!');
    // });

    const completed = await canvas.findByText('Completed!!');
    await expect(completed).toBeInTheDocument();
  },
};

export const AsyncWaitFor = {
  play: async ({ canvasElement, step }) => {
    const canvas = safeWithin(canvasElement);
    await step('Setup', Callback.play);
    await waitFor(async () => canvas.getByText('Completed!!'));
  },
};

export const WaitForElementToBeRemoved = {
  play: async ({ canvasElement, step }) => {
    const canvas = safeWithin(canvasElement);
    await step('Setup', SyncWaitFor.play);
    await waitForElementToBeRemoved(() => canvas.queryByText('Completed!!'), {
      timeout: 2000,
    });
  },
};

export const WithLoaders = {
  loaders: [async () => new Promise((resolve) => setTimeout(resolve, 2000))],
  play: async ({ step }) => {
    await step('Setup', Callback.play);
  },
};

export const Validation = {
  play: async (context) => {
    const { args, canvasElement, step } = context;
    const canvas = safeWithin(canvasElement);

    await step('Submit', async () => fireEvent.click(canvas.getByRole('button')));

    await expect(args.onSuccess).not.toHaveBeenCalled();
  },
};

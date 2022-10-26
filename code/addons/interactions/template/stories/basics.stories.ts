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

export const AType = {
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 0));
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByTestId('value'), 'test');
  },
};

export const BStep = {
  play: async ({ step }) => {
    await new Promise((r) => setTimeout(r, 1000));
    await step('Enter value', AType.play);
  },
};

export const CCallback = {
  play: async ({ args, canvasElement, step }) => {
    await new Promise((r) => setTimeout(r, 2000));
    const canvas = within(canvasElement);
    await step('Enter value', AType.play);

    await step('Submit', async () => {
      await fireEvent.click(canvas.getByRole('button'));
    });

    await expect(args.onSuccess).toHaveBeenCalled();
  },
};

// NOTE: of course you can use `findByText()` to implicitly waitFor, but we want
// an explicit test here
export const DSyncWaitFor = {
  play: async ({ canvasElement, step }) => {
    await new Promise((r) => setTimeout(r, 3000));
    const canvas = within(canvasElement);
    await step('Submit form', CCallback.play);
    await waitFor(() => canvas.getByText('Completed!!'));
  },
};

export const EAsyncWaitFor = {
  play: async ({ canvasElement, step }) => {
    await new Promise((r) => setTimeout(r, 4000));
    const canvas = within(canvasElement);
    await step('Submit form', CCallback.play);
    await waitFor(async () => canvas.getByText('Completed!!'));
  },
};

export const FWaitForElementToBeRemoved = {
  play: async ({ canvasElement, step }) => {
    await new Promise((r) => setTimeout(r, 5000));
    const canvas = within(canvasElement);
    await step('SyncWaitFor play fn', DSyncWaitFor.play);
    await waitForElementToBeRemoved(() => canvas.queryByText('Completed!!'), {
      timeout: 2000,
    });
  },
};

export const GWithLoaders = {
  loaders: [async () => new Promise((resolve) => setTimeout(resolve, 2000))],
  play: async ({ step }) => {
    await new Promise((r) => setTimeout(r, 6000));
    await step('Submit form', CCallback.play);
  },
};

export const HValidation = {
  play: async (context) => {
    await new Promise((r) => setTimeout(r, 7000));
    const { args, canvasElement, step } = context;
    const canvas = within(canvasElement);

    await step('Submit', async () => fireEvent.click(canvas.getByRole('button')));

    await expect(args.onSuccess).not.toHaveBeenCalled();
  },
};

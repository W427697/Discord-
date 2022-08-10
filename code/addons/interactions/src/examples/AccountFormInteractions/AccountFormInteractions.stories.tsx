import { Meta, ComponentStoryObj } from '@storybook/react';
import { expect } from '@storybook/jest';
import { within, waitFor, fireEvent, userEvent } from '@storybook/testing-library';

import { AccountForm } from './AccountFormInteractions';

export default {
  title: 'Addons/Interactions/Examples/AccountForm',
  component: AccountForm,
  parameters: {
    layout: 'centered',
    theme: 'light',
    options: { selectedPanel: 'storybook/interactions/panel' },
  },
  argTypes: {
    onSubmit: { action: true },
  },
} as Meta;

type CSF3Story = ComponentStoryObj<typeof AccountForm>;

export const Standard: CSF3Story = {
  args: { passwordVerification: false },
};

export const StandardEmailFilled = {
  ...Standard,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await fireEvent.change(canvas.getByTestId('email'), {
      target: { value: 'michael@chromatic.com' },
    });
  },
};

export const StandardEmailFailed = {
  ...Standard,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByTestId('email'), 'gert@chromatic');
    await userEvent.type(canvas.getByTestId('password1'), 'supersecret');
    await userEvent.click(canvas.getByRole('button', { name: /create account/i }));

    await canvas.findByText('Please enter a correctly formatted email address');
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

export const StandardEmailSuccess = {
  ...Standard,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByTestId('email'), 'michael@chromatic.com');
    await userEvent.type(canvas.getByTestId('password1'), 'testpasswordthatwontfail');
    await userEvent.click(canvas.getByTestId('submit'));

    await waitFor(async () => {
      await expect(args.onSubmit).toHaveBeenCalledTimes(1);
      await expect(args.onSubmit).toHaveBeenCalledWith({
        email: 'michael@chromatic.com',
        password: 'testpasswordthatwontfail',
      });
    });
  },
};

export const StandardPasswordFailed = {
  ...Standard,
  play: async (context) => {
    const canvas = within(context.canvasElement);
    await StandardEmailFilled.play(context);

    await userEvent.type(canvas.getByTestId('password1'), 'asdf');
    await userEvent.click(canvas.getByTestId('submit'));
  },
};

export const StandardFailHover = {
  ...StandardPasswordFailed,
  play: async (context) => {
    const canvas = within(context.canvasElement);
    await StandardPasswordFailed.play(context);
    await waitFor(async () => {
      await userEvent.hover(canvas.getByTestId('password-error-info'));
    });
  },
};

export const Verification = {
  args: { passwordVerification: true },
  argTypes: { onSubmit: { action: 'clicked' } },
};

export const VerificationPassword = {
  ...Verification,
  play: async (context) => {
    const canvas = within(context.canvasElement);
    await StandardEmailFilled.play(context);

    await userEvent.type(canvas.getByTestId('password1'), 'asdfasdf');
    await userEvent.click(canvas.getByTestId('submit'));
  },
};

export const VerificationPasswordMismatch = {
  ...Verification,
  play: async (context) => {
    const canvas = within(context.canvasElement);
    await StandardEmailFilled.play(context);

    await userEvent.type(canvas.getByTestId('password1'), 'asdfasdf');
    await userEvent.type(canvas.getByTestId('password2'), 'asdf1234');
    await userEvent.click(canvas.getByTestId('submit'));
  },
};

export const VerificationSuccess = {
  ...Verification,
  play: async (context) => {
    const canvas = within(context.canvasElement);
    await StandardEmailFilled.play(context);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    await userEvent.type(canvas.getByTestId('password1'), 'helloyou', { delay: 50 });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await userEvent.type(canvas.getByTestId('password2'), 'helloyou', { delay: 50 });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    await userEvent.click(canvas.getByTestId('submit'));
  },
};

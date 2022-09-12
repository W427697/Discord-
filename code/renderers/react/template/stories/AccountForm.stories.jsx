/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { userEvent, within } from '@storybook/testing-library';

import { AccountForm, AccountFormProps } from './AccountForm';

export default {
  component: AccountForm,
  parameters: {
    layout: 'centered',
  },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const Standard = {
  args: { passwordVerification: false },
};

export const StandardEmailFilled = {
  ...Standard,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByTestId('email'), 'michael@chromatic.com');
  },
};

export const StandardEmailFailed = {
  ...Standard,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByTestId('email'), 'michael@chromatic.com.com@com');
    await userEvent.type(canvas.getByTestId('password1'), 'testpasswordthatwontfail');
    await userEvent.click(canvas.getByTestId('submit'));
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
    await sleep(100);
    await userEvent.hover(canvas.getByTestId('password-error-info'));
  },
};
StandardFailHover.parameters = {
  // IE fails with userEvent.hover
  chromatic: { disableSnapshot: true },
};

export const Verification = {
  args: { passwordVerification: true },
};

export const VerificationPasssword1 = {
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
    await sleep(1000);
    await userEvent.type(canvas.getByTestId('password1'), 'asdfasdf', { delay: 50 });
    await sleep(1000);
    await userEvent.type(canvas.getByTestId('password2'), 'asdfasdf', { delay: 50 });
    await sleep(1000);
    await userEvent.click(canvas.getByTestId('submit'));
  },
};
// IE fails with this interaction
VerificationSuccess.parameters = {
  chromatic: {
    disableSnapshot: true,
  },
};

export const StandardWithRenderFunction = {
  ...Standard,
  render: (args: AccountFormProps) => (
    <div>
      <p>This uses a custom render</p>
      <AccountForm {...args} />
    </div>
  ),
};

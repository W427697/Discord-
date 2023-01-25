import { global as globalThis } from '@storybook/global';
import type { PlayFunctionContext } from '@storybook/types';
import { within, waitFor } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { FORCE_REMOUNT, RESET_STORY_ARGS, UPDATE_STORY_ARGS } from '@storybook/core-events';

export default {
  component: globalThis.Components.Button,
  args: {
    label: 'Click me',
  },
};

export const ForceRemount = {
  play: async ({ canvasElement, id }: PlayFunctionContext<any>) => {
    const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;
    const button = await within(canvasElement).findByRole('button');
    await button.focus();
    await expect(button).toHaveFocus();
    // By forcing the component to remount, we reset the focus state
    await channel.emit(FORCE_REMOUNT, { storyId: id });
    await waitFor(() => expect(button).not.toHaveFocus());
  },
};

export const ChangeArgs = {
  play: async ({ canvasElement, id }: PlayFunctionContext<any>) => {
    const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;
    const button = await within(canvasElement).findByRole('button');
    await button.focus();
    await expect(button).toHaveFocus();

    // Web-components: https://github.com/storybookjs/storybook/issues/19415
    // Preact: https://github.com/storybookjs/storybook/issues/19504
    if (['web-components', 'html', 'preact'].includes(globalThis.storybookRenderer)) return;

    // When we change the args to the button, it should not remount
    await channel.emit(UPDATE_STORY_ARGS, { storyId: id, updatedArgs: { label: 'New Text' } });
    await within(canvasElement).findByText(/New Text/);
    await expect(button).toHaveFocus();

    await channel.emit(RESET_STORY_ARGS, { storyId: id });
    await within(canvasElement).findByText(/Click me/);
    await expect(button).toHaveFocus();
  },
};

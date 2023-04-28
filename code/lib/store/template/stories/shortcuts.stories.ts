import { global as globalThis } from '@junk-temporary-prototypes/global';
import { userEvent, within } from '@junk-temporary-prototypes/testing-library';
import { PREVIEW_KEYDOWN } from '@junk-temporary-prototypes/core-events';
import { jest, expect } from '@junk-temporary-prototypes/jest';
import type { PlayFunctionContext } from '@junk-temporary-prototypes/csf';

export default {
  component: globalThis.Components.Form,
  tags: ['autodocs'],
};

export const KeydownDuringPlay = {
  play: async ({ canvasElement }: PlayFunctionContext<any>) => {
    const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;

    const previewKeydown = jest.fn();
    channel.on(PREVIEW_KEYDOWN, previewKeydown);
    const button = await within(canvasElement).findByText('Submit');
    await userEvent.type(button, 's');

    expect(previewKeydown).not.toBeCalled();
  },
};

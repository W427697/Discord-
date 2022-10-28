import globalThis from 'global';
import { userEvent, within } from '@storybook/testing-library';
import { PREVIEW_KEYDOWN } from '@storybook/core-events';
import { jest, expect } from '@storybook/jest';

export default {
  component: globalThis.Components.Form,
  tags: ['docsPage'],
};

export const KeydownDuringPlay = {
  play: async ({ canvasElement }) => {
    const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;

    const previewKeydown = jest.fn();
    channel.on(PREVIEW_KEYDOWN, previewKeydown);
    // eslint-disable-next-line storybook/await-interactions
    const promise = userEvent.type(await within(canvasElement).findByTestId('value'), '000000', {
      delay: 100,
    });

    const button = await within(canvasElement).findByRole('button');
    button.focus();

    await promise;

    expect(previewKeydown).not.toBeCalled();
  },
};

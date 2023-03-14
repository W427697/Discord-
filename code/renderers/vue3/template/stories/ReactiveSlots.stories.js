import { expect } from '@storybook/jest';
import { global as globalThis } from '@storybook/global';
import { within, userEvent } from '@storybook/testing-library';
import { UPDATE_STORY_ARGS, STORY_ARGS_UPDATED, RESET_STORY_ARGS } from '@storybook/core-events';
import { h } from 'vue';
import BaseLayout from './BaseLayout.vue';

export default {
  component: BaseLayout,
};

export const ReactiveSlotTest = {
  args: {
    default: 'Default Text Slot',
    header: () => h('h1', 'Header Functional Component Slot'),
    footer: h('p', 'Footer VNode Slot'),
  },
  // test that args are updated correctly in rective mode
  play: async ({ canvasElement, id }) => {
    const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;
    const canvas = within(canvasElement);

    await channel.emit(RESET_STORY_ARGS, { storyId: id });
    await new Promise((resolve) => {
      channel.once(STORY_ARGS_UPDATED, resolve);
    });
    await expect(canvas.getByTestId('default-slot')).toHaveTextContent('Default Text Slot');
    await expect(canvas.getByTestId('header-slot')).toHaveTextContent(
      'Header Functional Component Slot'
    );
    await expect(canvas.getByTestId('footer-slot')).toHaveTextContent('Footer VNode Slot');

    // click to update the label to increment the count + 1
    await channel.emit(UPDATE_STORY_ARGS, {
      storyId: id,
      updatedArgs: {
        default: 'default updated',
        header: () => h('h1', 'header updated'),
        footer: h('p', 'footer updated'),
      },
    });
    await new Promise((resolve) => {
      channel.once(STORY_ARGS_UPDATED, resolve);
    });
    await expect(canvas.getByTestId('header-slot')).toHaveTextContent('header updated');
    await expect(canvas.getByTestId('default-slot')).toHaveTextContent('default updated');
    await expect(canvas.getByTestId('footer-slot')).toHaveTextContent('footer updated');
  },
};

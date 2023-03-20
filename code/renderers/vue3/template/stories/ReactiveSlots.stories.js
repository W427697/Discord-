import { expect } from '@storybook/jest';
import { global as globalThis } from '@storybook/global';
import { within, userEvent } from '@storybook/testing-library';
import { UPDATE_STORY_ARGS, STORY_ARGS_UPDATED, RESET_STORY_ARGS } from '@storybook/core-events';
import { h } from 'vue';
import BaseLayout from './BaseLayout.vue';

export default {
  component: BaseLayout,
  tags: ['autodocs'],
};

export const SimpleSlotTest = {
  args: {
    label: 'Storybook Day',
    default: () => 'Default Text Slot',
    footer: h('h2', 'Footer VNode Slot'),
  },
  play: async ({ canvasElement, id }) => {
    const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;
    const canvas = within(canvasElement);

    await channel.emit(RESET_STORY_ARGS, { storyId: id });
    await new Promise((resolve) => {
      channel.once(STORY_ARGS_UPDATED, resolve);
    });
    await expect(canvas.getByTestId('footer-slot').innerText).toContain('Footer VNode Slot');
  },
};

export const NamedSlotTest = {
  args: {
    label: 'Storybook Day',
    header: ({ title }) => h('h1', title),
    default: () => 'Default Text Slot',
    footer: h('h2', 'Footer VNode Slot'),
  },
  // test that args are updated correctly in rective mode
  play: async ({ canvasElement, id }) => {
    const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;
    const canvas = within(canvasElement);

    await channel.emit(RESET_STORY_ARGS, { storyId: id });
    await new Promise((resolve) => {
      channel.once(STORY_ARGS_UPDATED, resolve);
    });
    await expect(canvas.getByTestId('header-slot').innerText).toContain(
      'Header title from the slot'
    );
    await expect(canvas.getByTestId('default-slot').innerText).toContain('Default Text Slot');
    await expect(canvas.getByTestId('footer-slot').innerText).toContain('Footer VNode Slot');

    await channel.emit(UPDATE_STORY_ARGS, {
      storyId: id,
      updatedArgs: {
        label: 'Storybook Day updated',
        header: () => h('h1', 'Header updated'),
        default: () => 'Default updated',
        footer: h('h2', 'Footer updated'),
      },
    });
  },
};

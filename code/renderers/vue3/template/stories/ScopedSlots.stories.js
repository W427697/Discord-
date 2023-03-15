import { expect } from '@storybook/jest';
import { global as globalThis } from '@storybook/global';
import { within, userEvent } from '@storybook/testing-library';
import { UPDATE_STORY_ARGS, STORY_ARGS_UPDATED, RESET_STORY_ARGS } from '@storybook/core-events';
import { h } from 'vue';
import MySlotComponent from './MySlotComponent.vue';

export default {
  component: MySlotComponent,
};

export const ReactiveScopedSlot = {
  args: { label: 'Storybook Day', year: 2022 },
  render: (args) => ({
    components: { MySlotComponent },
    setup() {
      return { args };
    },
    template: `<MySlotComponent :label="args.label" v-slot="slotProps" data-testid="scoped-slot">
  	              {{ slotProps.text }} , {{ slotProps.year }}
              </MySlotComponent>`,
  }),

  // test that args are updated correctly in rective mode
  play: async ({ canvasElement, id }) => {
    const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;
    const canvas = within(canvasElement);

    await channel.emit(RESET_STORY_ARGS, { storyId: id });
    await new Promise((resolve) => {
      channel.once(STORY_ARGS_UPDATED, resolve);
    });
    await expect(canvas.getByTestId('scoped-slot')).toHaveTextContent(
      'Hello Storybook Day from the slot , 2022'
    );

    await channel.emit(UPDATE_STORY_ARGS, {
      storyId: id,
      updatedArgs: {
        label: 'Storybook Day updated',
        year: 2023,
      },
    });
    await new Promise((resolve) => {
      channel.once(STORY_ARGS_UPDATED, resolve);
    });
    await expect(canvas.getByTestId('scoped-slot')).toHaveTextContent(
      'Hello Storybook Day updated from the slot , 2023'
    );
  },
};

export const FunctionScopedSlot = {
  args: {
    label: 'Storybook Day',
    year: 2022,
    default: (slotProps) => {
      return `${slotProps.text} ${slotProps.year}`;
    },
  },
  render: (args) => ({
    components: { MySlotComponent },
    setup() {
      return { args };
    },
    template: `<MySlotComponent :label="args.label" v-slot="slotProps" data-testid="fn-scoped-slot">
  	            {{args.default(slotProps)}}
              </MySlotComponent>`,
  }),

  // test that args are updated correctly in rective mode
  play: async ({ canvasElement, id }) => {
    const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;
    const canvas = within(canvasElement);

    await channel.emit(RESET_STORY_ARGS, { storyId: id });
    await new Promise((resolve) => {
      channel.once(STORY_ARGS_UPDATED, resolve);
    });
    await expect(canvas.getByTestId('fn-scoped-slot')).toHaveTextContent(
      'Hello Storybook Day from the slot 2022'
    );

    await channel.emit(UPDATE_STORY_ARGS, {
      storyId: id,
      updatedArgs: {
        label: 'Storybook Day updated',
        year: 2023,
      },
    });
    await new Promise((resolve) => {
      channel.once(STORY_ARGS_UPDATED, resolve);
    });
    await expect(canvas.getByTestId('fn-scoped-slot')).toHaveTextContent(
      'Hello Storybook Day updated from the slot 2023'
    );
  },
};

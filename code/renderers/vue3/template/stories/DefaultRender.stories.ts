import { global as globalThis } from '@storybook/global';
import { userEvent, within } from '@storybook/testing-library';
import type { Meta, StoryObj } from '@storybook/vue3';
import { h } from 'vue';
import { RESET_STORY_ARGS, STORY_ARGS_UPDATED, UPDATE_STORY_ARGS } from '@storybook/core-events';
import Reactivity from './Reactivity.vue';

const meta = {
  component: Reactivity,
  args: { label: 'If you see this, args are not updated properly' },
  play: async ({ canvasElement, id, args }) => {
    const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;

    const canvas = within(canvasElement);

    if (args.label !== 'If you see this, args are not updated properly') {
      channel.emit(RESET_STORY_ARGS, { storyId: id });
      await new Promise((resolve) => channel.once(STORY_ARGS_UPDATED, resolve));
    }

    const input = await canvas.findByLabelText<HTMLInputElement>('Some input:');
    await userEvent.type(input, 'value');

    channel.emit(UPDATE_STORY_ARGS, {
      storyId: id,
      updatedArgs: { label: 'updated label' },
    });
    await new Promise((resolve) => channel.once(STORY_ARGS_UPDATED, resolve));
  },
} satisfies Meta<typeof Reactivity>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoDecorators: Story = {};

export const DecoratorVNode: Story = {
  decorators: [
    (storyFn, context) => {
      return h('div', [h('div', ['Decorator not using args']), [h(storyFn())]]);
    },
  ],
};

export const DecoratorVNodeArgsFromContext: Story = {
  decorators: [
    (storyFn, context) => {
      return h('div', [h('div', ['Decorator using label: ', context.args.label]), [h(storyFn())]]);
    },
  ],
};

export const DecoratorVNodeTemplate: Story = {
  decorators: [
    (storyFn, context) => {
      return h({
        components: {
          story: storyFn(),
        },
        template: '<div><div>Decorator not using args</div><story/></div>',
      });
    },
  ],
};

export const DecoratorVNodeTemplateArgsFromData: Story = {
  decorators: [
    (storyFn, context) => {
      return h({
        components: {
          story: storyFn(),
        },
        data() {
          return { args: context.args };
        },
        template: '<div><div>Decorator using label: {{args.label}}</div><story/></div>',
      });
    },
  ],
};

export const DecoratorVNodeTemplateArgsFromProps: Story = {
  decorators: [
    (storyFn, context) => {
      return h({
        components: {
          story: storyFn(),
        },
        props: ['label'],
        template: '<div><div>Decorator using label: {{label}}</div><story/></div>',
      });
    },
  ],
};

export const DecoratorFunctionalComponent: Story = {
  decorators: [
    (storyFn, context) => {
      return () => h('div', [h('div', ['Decorator not using args']), [h(storyFn())]]);
    },
  ],
};

export const DecoratorFunctionalComponentArgsFromContext: Story = {
  decorators: [
    (storyFn, context) => {
      return () =>
        h('div', [h('div', ['Decorator using args.label: ', context.args.label]), [h(storyFn())]]);
    },
  ],
};

export const DecoratorFunctionalComponentArgsFromProps: Story = {
  decorators: [
    (storyFn, context) => {
      return (args) =>
        h('div', [h('div', ['Decorator using args.label: ', args.label]), [h(storyFn())]]);
    },
  ],
};

export const DecoratorComponentOptions: Story = {
  decorators: [
    (storyFn, context) => {
      return {
        template: '<div><div>Decorator not using args</div><story/></div>',
      };
    },
  ],
};

export const DecoratorComponentOptionsArgsFromData: Story = {
  decorators: [
    (storyFn, context) => {
      return {
        data: () => ({
          args: context.args,
        }),
        template: '<div><div>Decorator using args.label: {{args.label}}</div><story/></div>',
      };
    },
  ],
};

export const DecoratorComponentOptionsArgsFromProps: Story = {
  decorators: [
    (storyFn, context) => {
      return {
        props: ['label'],
        template: '<div><div>Decorator using args.label: {{label}}</div><story/></div>',
      };
    },
  ],
};

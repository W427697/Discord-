import { global as globalThis } from '@storybook/global';
import { userEvent, within } from '@storybook/testing-library';
import type { Meta, StoryObj } from '@storybook/vue3';
import { h } from 'vue';
import { RESET_STORY_ARGS, STORY_ARGS_UPDATED, UPDATE_STORY_ARGS } from '@storybook/core-events';
import Reactivity from './Reactivity.vue';

const meta = {
  component: Reactivity,
  args: { label: 'initial' },
  play: async ({ canvasElement, id, args }) => {
    const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;

    const canvas = within(canvasElement);

    await channel.emit(RESET_STORY_ARGS, { storyId: id });
    await new Promise((resolve) => channel.once(STORY_ARGS_UPDATED, resolve));

    const input = await canvas.findByLabelText<HTMLInputElement>('Some input:');
    await userEvent.type(input, 'value');

    await channel.emit(UPDATE_STORY_ARGS, {
      storyId: id,
      updatedArgs: { label: 'updated label' },
    });
    await new Promise((resolve) => channel.once(STORY_ARGS_UPDATED, resolve));
  },
} satisfies Meta<typeof Reactivity>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoDecorators: Story = { args: { label: 'No decorators' } };

/**
 * Decorator should either be a function that returns a VNode or a component
 * so using VNode is not recommended to wrap the story if you want to use args in reactive mode
 */
export const DecoratorVNode: Story = {
  args: { label: 'Decorator not using args' },
  decorators: [
    (storyFn, context) => {
      return h('div', h(storyFn(context.args)));
    },
  ],
};

export const DecoratorVNodeArgsFromContext: Story = {
  args: { label: 'Decorator using label from context' },
  decorators: [
    (storyFn, context) => {
      return h('div', [
        h('h2', `Decorator use args: ${context.args.label}`),
        [h(storyFn(context.args))],
      ]);
    },
  ],
};

export const DecoratorVNodeTemplate: Story = {
  args: { label: 'Decorator not using args' },
  decorators: [
    (storyFn, context) => {
      return h({
        components: {
          story: storyFn(context.args),
        },
        template: '<div><h2>Decorator not using args</h2><story/></div>',
      });
    },
  ],
};

export const DecoratorVNodeTemplateArgsFromData: Story = {
  decorators: [
    (storyFn, context) => {
      return h({
        components: {
          story: storyFn(context.args),
        },
        data() {
          return { args: context.args };
        },
        template: '<div><h2>Decorator using label: {{args.label}}</h2><story/></div>',
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
        template: '<div><h1>Decorator using label: {{label}}</h1><story/></div>',
      });
    },
  ],
};

export const DecoratorFunctionalComponent: Story = {
  decorators: [
    (storyFn, context) => {
      return () => h('div', [h('h2', ['Decorator not using args']), [h(storyFn())]]);
    },
  ],
};

export const DecoratorFunctionalComponentArgsFromContext: Story = {
  decorators: [
    (storyFn, context) => {
      return () =>
        h('div', [h('h2', ['Decorator using args.label: ', context.args.label]), [h(storyFn())]]);
    },
  ],
};

export const DecoratorFunctionalComponentArgsFromProps: Story = {
  decorators: [
    (storyFn, context) => {
      return (args) => {
        return h('div', [h('h2', `Decorator using args.label: ${args.label}`), h(storyFn())]);
      };
    },
  ],
};

export const DecoratorComponentOptions: Story = {
  decorators: [
    (storyFn, context) => {
      return {
        template: '<div><h2>Decorator not using args</h2><story/></div>',
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
        template: '<div><h2>Decorator using args.label: {{args.label}}</h2><story/></div>',
      };
    },
  ],
};

export const DecoratorComponentOptionsArgsFromProps: Story = {
  decorators: [
    (storyFn, context) => {
      return {
        props: ['label'],
        template: '<div><h2>Decorator using label: {{label}}</h2><story /></div>',
      };
    },
  ],
};

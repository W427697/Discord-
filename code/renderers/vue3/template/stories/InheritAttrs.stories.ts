import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';
import type { Meta, StoryObj } from 'renderers/vue3/src';
import InheritAttrs from './InheritAttrs.vue';
import TestBtn from './TestBtn.vue';

const meta: Meta = {
  component: InheritAttrs,
  argTypes: {},
  render: (args: any) => ({
    // Components used in your story `template` are defined in the `components` object
    components: { InheritAttrs },
    // The story's `args` need to be mapped into the template through the `setup()` method
    setup() {
      return { args };
    },
    // And then the `args` are bound to your component with `v-bind="args"`
    template: '<inherit-attrs  />',
  }),
} satisfies Meta<typeof InheritAttrs>;

type Story = StoryObj<typeof meta>;

export default meta;

export const InheritAttrsTrue: Story = {
  args: {
    primary: true,
    class: 'storybook-button storybook-button--primary storybook-button--large',
    style: 'background-color: red',
  },
  parameters: {
    inheritAttrs: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('button')).toHaveStyle('background-color: rgb(255, 0, 0)'); // if inheritAttrs is true, then the style is applied
    expect(canvas.getByRole('button')).toHaveClass(
      'storybook-button',
      'storybook-button--primary',
      'storybook-button--large'
    ); // if inheritAttrs is true, then the class is applied
  },
};

export const InheritAttrsFalse: Story = {
  args: {
    class: 'storybook-button storybook-button--primary storybook-button--large',
    style: 'background-color: red',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('button')).not.toHaveStyle('background-color: rgb(255, 0, 0)'); // if inheritAttrs is true, then the style is applied
    expect(canvas.getByRole('button')).not.toHaveClass(
      'storybook-button',
      'storybook-button--primary',
      'storybook-button--large'
    ); // if inheritAttrs is false, then the style is not applied
  },
};

export const TooManyActionsFixed = {
  argTypes: {
    onClick: { action: 'clicked' },
  },
  render: (args: any) => ({
    components: { TestBtn },

    setup() {
      return { args };
    },
    template: `
    <div>
      <TestBtn v-bind="args"></TestBtn>
    </div>`,
  }),
};

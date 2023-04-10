import { global as globalThis } from '@storybook/global';
import { h } from 'vue';

const { Button, Pre } = globalThis.Components;

export default {
  component: Button,
};

const ComponentTemplateWrapper = () => ({
  components: {
    Pre,
  },
  template: `
    <Pre text="decorator" />
    <story v-bind="$attrs"/>
  `,
});

const SimpleTemplateWrapper = () => ({
  template: `
    <div style="border: 5px solid red;">
      <story/>
    </div>
    `,
});

const VueWrapperWrapper = (storyFn, context) => {
  // Call the `storyFn` to receive a component that Vue can render
  const story = storyFn();
  // Vue 3 "Functional" component as decorator
  return () => {
    return h('div', { style: 'border: 5px solid blue' }, h(story, context.args));
  };
};

const DynamicWrapperWrapper = (storyFn, { args }) => ({
  template: `<div :style="{ borderWidth: level, borderColor: 'green', borderStyle: 'solid' }"><story /></div>`,
  computed: { level: () => `${args.level}px` },
});

export const ComponentTemplate = {
  args: { label: 'With component' },
  decorators: [ComponentTemplateWrapper],
};

export const SimpleTemplate = {
  args: { label: 'With border' },
  decorators: [SimpleTemplateWrapper],
};

export const VueWrapper = {
  args: { label: 'With Vue wrapper' },
  decorators: [VueWrapperWrapper],
};

export const DynamicWrapper = {
  args: { label: 'With dynamic wrapper', primary: true },
  argTypes: {
    // Number type is detected, but we still want to constrain the range from 1-6
    level: { control: { type: 'range', min: 1, max: 6 } },
  },
  decorators: [DynamicWrapperWrapper],
};

export const MultipleWrappers = {
  args: { label: 'With multiple wrappers' },
  argTypes: {
    // Number type is detected, but we still want to constrain the range from 1-6
    level: { control: { type: 'range', min: 1, max: 6 } },
  },
  decorators: [
    ComponentTemplateWrapper,
    SimpleTemplateWrapper,
    VueWrapperWrapper,
    DynamicWrapperWrapper,
  ],
};

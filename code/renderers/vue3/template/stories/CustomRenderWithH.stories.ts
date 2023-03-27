import type { Meta } from '@storybook/vue3';
import { h } from 'vue';
import Reactivity from './Reactivity.vue';
import * as DefaultRenderStory from './DefaultRender.stories';

const meta = {
  ...DefaultRenderStory.default,
  render: (args) => {
    return h('div', ['Just wrapping something around the default render', h(Reactivity, args)]);
  },
} satisfies Meta<typeof Reactivity>;

export {
  NoDecorators,
  DecoratorVNode,
  DecoratorVNodeArgsFromContext,
  DecoratorVNodeTemplate,
  DecoratorVNodeTemplateArgsFromData,
  DecoratorVNodeTemplateArgsFromProps,
  DecoratorFunctionalComponent,
  DecoratorFunctionalComponentArgsFromContext,
  DecoratorFunctionalComponentArgsFromProps,
  DecoratorComponentOptions,
  DecoratorComponentOptionsArgsFromData,
  DecoratorComponentOptionsArgsFromProps,
} from './DefaultRender.stories';
export default meta;

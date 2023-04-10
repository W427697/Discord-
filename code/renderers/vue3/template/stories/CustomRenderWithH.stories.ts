import type { Meta } from '@storybook/vue3';
import type Reactivity from './Reactivity.vue';
import * as DefaultRenderStory from './DefaultRender.stories';

const meta = {
  ...DefaultRenderStory.default,
  title: 'Example/Reactivity',
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

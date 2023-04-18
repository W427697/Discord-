import type { Meta } from '@storybook/vue3';
import { defineComponent } from 'vue';
import Reactivity from './Reactivity.vue';
import * as ReactiveDecorators from './ReactiveDecorators.stories';

const meta = {
  ...ReactiveDecorators.default,
  component: Reactivity,
  render: (args, { argTypes }) => {
    return defineComponent({
      data: () => ({ args }),
      components: {
        Reactivity,
      },
      template:
        '<div>Custom render uses options api and binds args to data: <Reactivity v-bind="args"/></div>',
    });
  },
} satisfies Meta<typeof Reactivity>;

export default meta;

export {
  NoDecorators,
  DecoratorFunctionalComponent,
  DecoratorFunctionalComponentArgsFromContext,
  DecoratorFunctionalComponentArgsFromProps,
  DecoratorComponentOptions,
  DecoratorComponentOptionsArgsFromData,
  DecoratorComponentOptionsArgsFromProps,
} from './ReactiveDecorators.stories';

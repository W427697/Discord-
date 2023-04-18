import type { Meta } from '@storybook/vue3';
import { defineComponent, shallowReactive } from 'vue';
import Reactivity from './Reactivity.vue';
import * as ReactiveDecorators from './ReactiveDecorators.stories';

// when you use custom render, you can use any vue api to create your story and garanti reactivity, otherwise i can ease kill the reactivity.
const state = shallowReactive<{ header: any }>({ header: '' }); // or reactive

const meta = {
  ...ReactiveDecorators.default,
  component: Reactivity,
  argTypes: { header: { control: { type: 'text' } } },
  render: (args, { argTypes }) => {
    state.header = args.header;
    return defineComponent({
      data: () => ({ args, header: state.header }),
      components: {
        Reactivity,
      },
      template: `<div>Custom render uses options api and binds args to data: 
                    <Reactivity v-bind="args">
                      <template #header="{title}">{{ header }} - Title: {{ title }}</template>
                    </Reactivity>
                  </div>`,
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

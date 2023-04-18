import type { Meta } from '@storybook/vue3';
import { defineComponent, ref } from 'vue';
import Reactivity from './Reactivity.vue';
import * as ReactiveDecorators from './ReactiveDecorators.stories';

// when use custom render, you can use any vue api to create your story and garanti reactivity, otherwise i can ease kill the reactivity.
const headerRef = ref(''); // or reactive

const meta = {
  ...ReactiveDecorators.default,
  component: Reactivity,
  argTypes: { header: { control: { type: 'text' } } },
  render: (args, { argTypes }) => {
    headerRef.value = args.header;
    return defineComponent({
      data: () => ({ args, header: headerRef }),
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

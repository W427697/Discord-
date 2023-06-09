import type { Meta } from '@storybook/vue3';
import { h } from 'vue';
import Reactivity from './Reactivity.vue';
import * as ReactiveDecorators from './ReactiveDecorators.stories';

const meta = {
  ...ReactiveDecorators.default,
  component: Reactivity,
  // storybook render function is not a functional component. it returns a functional component or a component options
  render: (args) => {
    // create the slot contents as a functional components
    const header = ({ title }: { title: string }) => h('h4', `${args.header} - Title: ${title}`);
    const defaultSlot = () => h('p', `${args.default}`);
    const footer = () => h('p', `${args.footer}`);
    // vue render function is a functional components
    return () =>
      h('div', [
        h('h3', 'Custom render returns a functional component'),
        h(Reactivity, args, { header, default: defaultSlot, footer }),
      ]);
  },
} satisfies Meta<typeof Reactivity>;

export default meta;

export {
  NoDecorators,
  DecoratorFunctionalComponent,
  DecoratorFunctionalComponentArgsFromContext,
  DecoratorComponentOptions,
  DecoratorComponentOptionsArgsFromData,
} from './ReactiveDecorators.stories';

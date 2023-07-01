import type { Meta } from 'renderers/vue3';
import { h, type Component } from 'vue';
import type { Args } from 'renderers/vue3/src/types';
import Reactivity from './Reactivity.vue';
import * as ReactiveDecorators from './ReactiveDecorators.stories';

const meta = {
  ...ReactiveDecorators.default,
  component: Reactivity,
  // storybook render function is not a functional component. it returns a functional component or a component options
  render: (args: Args) => {
    // create the slot contents as a functional components
    const header = ({ title }: { title: string }) => h('h3', `${args.header} - Title: ${title}`);
    const defaultSlot = () => h('p', `${args.default}`);
    const footer = () => h('p', `${args.footer}`);
    // vue render function is a functional components
    const ReactivityComponent: Component = Reactivity;
    return () =>
      h('div', [
        `Custom render uses a functional component, and passes slots to the component:`,
        h(ReactivityComponent, args, { header, default: defaultSlot, footer }),
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

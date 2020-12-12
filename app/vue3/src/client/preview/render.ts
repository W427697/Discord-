import { Args } from '@storybook/addons';
import dedent from 'ts-dedent';
import { createApp, h, shallowRef, reactive, ComponentOptions, ComponentPublicInstance } from 'vue';
import { RenderContext, StoryFnVueReturnType } from './types';

const activeComponent = shallowRef<StoryFnVueReturnType | null>(null);
export const propsContainer = reactive<{ props: Args }>({ props: {} });

let rootVm: ComponentPublicInstance = null;
const rootFactory = () =>
  createApp({
    setup() {
      return () => {
        if (!activeComponent.value) throw new Error();
        return h(activeComponent.value as ComponentOptions, propsContainer.props);
      };
    },
  });

let root = rootFactory();

export function render({
  storyFn,
  kind,
  name,
  args,
  showMain,
  showError,
  showException,
  forceRender,
}: RenderContext) {
  root.config.errorHandler = showException;

  const element: StoryFnVueReturnType = storyFn();
  propsContainer.props = args;

  if (!element) {
    showError({
      title: `Expecting a Vue component from the story: "${name}" of "${kind}".`,
      description: dedent`
        Did you forget to return the Vue component from the story?
        Use "() => ({ template: '<my-comp></my-comp>' })" or "() => ({ components: MyComp, template: '<my-comp></my-comp>' })" when defining the story.
      `,
    });
    return;
  }

  showMain();

  activeComponent.value = element;

  if (forceRender && rootVm) {
    root.unmount('#root');
    root = rootFactory();
    rootVm = null;
  }

  if (!rootVm) {
    rootVm = root.mount('#root');
  }
}

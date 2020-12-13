import { Args } from '@storybook/addons';
import dedent from 'ts-dedent';
import { createApp, h, shallowRef, reactive, ComponentOptions, ComponentPublicInstance } from 'vue';
import { RenderContext, StoryFnVueReturnType } from './types';

const activeComponent = shallowRef<StoryFnVueReturnType | null>(null);
export const propsContainer = reactive<{ props: Args }>({ props: {} });

export const app = createApp({
  setup() {
    return () => {
      if (!activeComponent.value) throw new Error('Component is not set correctly');
      return h(activeComponent.value as ComponentOptions, propsContainer.props);
    };
  },
});

let appVm: ComponentPublicInstance = null;
export function render({
  storyFn,
  kind,
  name,
  args,
  showMain,
  showError,
  showException,
}: RenderContext) {
  app.config.errorHandler = showException;

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

  if (!appVm) {
    appVm = app.mount('#root');
  }
}

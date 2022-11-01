import { dedent } from 'ts-dedent';
import { createApp, h } from 'vue';
import type { Store_RenderContext, ArgsStoryFn } from '@storybook/types';

import type { StoryFnVueReturnType, VueFramework } from './types';

export const render: ArgsStoryFn<VueFramework> = (props, context) => {
  const { id, component: Component } = context;
  if (!Component) {
    throw new Error(
      `Unable to render story ${id} as the component annotation is missing from the default export`
    );
  }

  return h(Component, props);
};

let setupFunction = (app: any) => {};
export const setup = (fn: (app: any) => void) => {
  setupFunction = fn;
};

const componentsByDomElementId = new Map<string, ReturnType<typeof createApp>>();

export function renderToDOM(
  {
    title,
    name,
    storyFn,
    showMain,
    showError,
    showException,
    storyContext,
  }: Store_RenderContext<VueFramework>,
  domElement: Element
) {
  // in docs mode we're rendering multiple stories to the DOM, so we need to key by the story id
  const domElementKey = storyContext.viewMode === 'docs' ? storyContext.id : 'storybook-root';

  // TODO: explain cyclical nature of these app => story => mount
  let element: StoryFnVueReturnType;
  const storybookApp = createApp({
    unmounted() {
      componentsByDomElementId.delete(domElementKey);
    },
    render() {
      componentsByDomElementId.set(domElementKey, storybookApp);
      setupFunction(storybookApp);
      return h(element);
    },
  });
  storybookApp.config.errorHandler = (e: unknown) => showException(e as Error);
  element = storyFn();

  if (!element) {
    showError({
      title: `Expecting a Vue component from the story: "${name}" of "${title}".`,
      description: dedent`
      Did you forget to return the Vue component from the story?
      Use "() => ({ template: '<my-comp></my-comp>' })" or "() => ({ components: MyComp, template: '<my-comp></my-comp>' })" when defining the story.
      `,
    });
    return;
  }

  showMain();

  componentsByDomElementId.get(domElementKey)?.unmount();

  storybookApp.mount(domElement);
}

import { dedent } from 'ts-dedent';
import { createApp, h, reactive } from 'vue';
import type { Store_RenderContext, ArgsStoryFn } from '@storybook/types';

import type { VueFramework } from './types';

export const render: ArgsStoryFn<VueFramework> = (props, context) => {
  const { id, component: Component } = context;
  if (!Component) {
    throw new Error(
      `Unable to render story ${id} as the component annotation is missing from the default export`
    );
  }
  return h(Component, props);
};

const appsAndArgsByDomElementKey = new Map<
  string,
  { app: ReturnType<typeof createApp>; reactiveArgs: any }
>();

const STORYBOOK_ROOT_ID = 'storybook-root';

function teardown(domElementKey: string) {
  if (!appsAndArgsByDomElementKey.has(domElementKey)) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we know it exists because we just checked
  appsAndArgsByDomElementKey.get(domElementKey)!.app.unmount();
  appsAndArgsByDomElementKey.delete(domElementKey);
}

let setupFunction = (app: any) => {};
export const setup = (fn: (app: any) => void) => {
  setupFunction = fn;
};

/* eslint-disable no-param-reassign */
function updateArgs(reactiveArgs: any, nextArgs: any) {
  if (!nextArgs) return;
  Object.entries(nextArgs).forEach(([key, value]) => {
    reactiveArgs[key] = value;
  });
  Object.keys(reactiveArgs).forEach((key) => {
    if (!nextArgs[key]) {
      reactiveArgs[key] = undefined;
    }
  });
}
/* eslint-enable no-param-reassign */

export function renderToDOM(
  {
    id,
    title,
    name,
    storyFn,
    showMain,
    showError,
    showException,
    storyContext,
    forceRemount,
  }: Store_RenderContext<VueFramework>,
  domElement: Element
) {
  // in docs mode we're rendering multiple stories to the DOM, so we need to key by the story id
  const domElementKey = storyContext.viewMode === 'docs' ? id : STORYBOOK_ROOT_ID;

  if (forceRemount) {
    teardown(domElementKey);
  }
  const existingApp = appsAndArgsByDomElementKey.get(domElementKey);

  const { args, ...element } = storyFn();

  if (!element) {
    showError({
      title: `Expecting a Vue component from the story: "${name}" of "${title}".`,
      description: dedent`
      Did you forget to return the Vue component from the story?
      Use "() => ({ template: '<my-comp></my-comp>' })" or "() => ({ components: MyComp, template: '<my-comp></my-comp>' })" when defining the story.
      `,
    });
    return () => {
      teardown(domElementKey);
    };
  }

  if (!existingApp || forceRemount) {
    const reactiveArgs = args ? reactive(args) : args;

    // TODO: explain cyclical nature of these app => story => mount
    const app = createApp({
      render() {
        appsAndArgsByDomElementKey.set(domElementKey, { app, reactiveArgs });
        return h(element, reactiveArgs);
      },
    });
    app.config.errorHandler = (e: unknown) => showException(e as Error);
    setupFunction(app);

    app.mount(domElement);
  } else {
    updateArgs(existingApp.reactiveArgs, args);
  }

  showMain();

  // teardown the component when the story changes
  return () => {
    teardown(domElementKey);
  };
}

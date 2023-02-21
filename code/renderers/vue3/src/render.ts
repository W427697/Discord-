/* eslint-disable no-param-reassign */
import { createApp, h, reactive } from 'vue';
import type { RenderContext, ArgsStoryFn } from '@storybook/types';
import type { Args, StoryContext } from '@storybook/csf';
import type { VueRenderer } from './types';

export const render: ArgsStoryFn<VueRenderer> = (props, context) => {
  const { id, component: Component } = context;
  if (!Component) {
    throw new Error(
      `Unable to render story ${id} as the component annotation is missing from the default export`
    );
  }

  return h(Component, props, getSlots(props, context));
};

let setupFunction = (_app: any) => {};
export const setup = (fn: (app: any) => void) => {
  setupFunction = fn;
};

const map = new Map<
  VueRenderer['canvasElement'],
  { vueApp: ReturnType<typeof createApp>; reactiveArgs: any; rootComponent: any }
>();

export function renderToCanvas(
  { storyFn, forceRemount, showMain, showException, storyContext }: RenderContext<VueRenderer>,
  canvasElement: VueRenderer['canvasElement']
) {
  // fetch the story with the updated context (with reactive args)
  const existingApp = map.get(canvasElement);

  storyContext.args = reactive(storyContext.args);
  const rootComponent: any = storyFn(); // !existingApp ? storyFn() : existingApp.rootComponent();

  const appProps =
    rootComponent.props ?? (typeof rootComponent === 'function' ? rootComponent().props : {});
  const reactiveArgs = Object.keys(appProps).length > 0 ? reactive(appProps) : storyContext.args;

  if (existingApp && !forceRemount) {
    updateArgs(existingApp.reactiveArgs, reactiveArgs);
    return () => {
      teardown(existingApp.vueApp, canvasElement);
    };
  }

  if (existingApp && forceRemount) teardown(existingApp.vueApp, canvasElement);

  const storybookApp = createApp({
    render() {
      map.set(canvasElement, { vueApp: storybookApp, reactiveArgs, rootComponent });
      return h(rootComponent, reactiveArgs);
    },
  });

  storybookApp.config.errorHandler = (e: unknown) => showException(e as Error);
  setupFunction(storybookApp);
  storybookApp.mount(canvasElement);

  showMain();
  return () => {
    teardown(storybookApp, canvasElement);
  };
}

/**
 * get the slots as functions to be rendered
 * @param props
 * @param context
 */

function getSlots(props: Args, context: StoryContext<VueRenderer, Args>) {
  const { argTypes } = context;
  const slots = Object.entries(props)
    .filter(([key, value]) => argTypes[key]?.table?.category === 'slots')
    .map(([key, value]) => [key, () => h('span', JSON.stringify(value))]);

  return Object.fromEntries(slots);
}

/**
 *  update the reactive args
 * @param reactiveArgs
 * @param nextArgs
 * @returns
 */
export function updateArgs(reactiveArgs: Args, nextArgs: Args) {
  if (!nextArgs) return;

  Object.keys(reactiveArgs).forEach((key) => delete reactiveArgs[key]);
  Object.assign(reactiveArgs, nextArgs);
}

function teardown(
  storybookApp: ReturnType<typeof createApp>,
  canvasElement: VueRenderer['canvasElement']
) {
  storybookApp?.unmount();
  if (map.has(canvasElement)) map.delete(canvasElement);
}

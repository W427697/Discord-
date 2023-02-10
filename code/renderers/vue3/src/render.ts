/* eslint-disable no-param-reassign */
import { dedent } from 'ts-dedent';
import { createApp, h, reactive, toRefs } from 'vue';
import type { RenderContext, ArgsStoryFn } from '@storybook/types';
import type { Args, StoryContext } from '@storybook/csf';
import type { StoryFnVueReturnType, VueRenderer } from './types';

export const render: ArgsStoryFn<VueRenderer> = (props, context) => {
  const { id, component: Component } = context;
  if (!Component) {
    throw new Error(
      `Unable to render story ${id} as the component annotation is missing from the default export`
    );
  }
  console.log(' -*****- render props', props, context);
  return h(Component, props, getSlots(props, context));
};

let setupFunction = (_app: any) => {};
export const setup = (fn: (app: any) => void) => {
  setupFunction = fn;
};

const map = new Map<
  VueRenderer['canvasElement'],
  { vueApp: ReturnType<typeof createApp>; reactiveArgs: any }
>();

const elementMap = new Map<VueRenderer['canvasElement'], StoryFnVueReturnType>();
export function renderToCanvas(
  {
    storyFn,
    forceRemount,
    showMain,
    showError,
    showException,
    name,
    title,
    storyContext,
  }: RenderContext<VueRenderer>,
  canvasElement: VueRenderer['canvasElement']
) {
  let reactiveArgs = reactive(storyContext.args); // useReactive(storyContext);
  // fetch the story with the updated context (with reactive args)
  storyContext.args = reactiveArgs;
  const element: StoryFnVueReturnType = storyFn();
  reactiveArgs = storyContext.args;
  elementMap.set(canvasElement, element);

  // getting the props from the render function
  const props = (element as any).render?.().props;
  if (props) reactiveArgs = reactive(props);

  const existingApp = map.get(canvasElement);
  if (existingApp && !forceRemount) {
    updateArgs(existingApp.reactiveArgs, reactiveArgs);
    return () => {
      teardown(existingApp.vueApp, canvasElement);
    };
  }

  if (existingApp && forceRemount) teardown(existingApp.vueApp, canvasElement);

  const storybookApp = createApp({
    render() {
      const currentElement: any = elementMap.get(canvasElement);
      const current = currentElement && currentElement.template ? currentElement : element; // elementMap.get(canvasElement) ??
      map.set(canvasElement, { vueApp: storybookApp, reactiveArgs });
      return h(current, reactiveArgs);
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
function updateArgs(reactiveArgs: Args, nextArgs: Args) {
  if (!nextArgs) return;
  Object.keys(reactiveArgs).forEach((key) => {
    delete reactiveArgs[key];
  });
  Object.assign(reactiveArgs, nextArgs);
}

function teardown(
  storybookApp: ReturnType<typeof createApp>,
  canvasElement: VueRenderer['canvasElement']
) {
  storybookApp?.unmount();
  if (map.has(canvasElement)) map.delete(canvasElement);
}

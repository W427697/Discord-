import { createApp, h, isReactive, reactive } from 'vue';
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
  { vueApp: ReturnType<typeof createApp>; reactiveArgs: any }
>();

export function renderToCanvas(
  { storyFn, forceRemount, showMain, showException, storyContext }: RenderContext<VueRenderer>,
  canvasElement: VueRenderer['canvasElement']
) {
  const existingApp = map.get(canvasElement);
  const reactiveArgs: Args = existingApp?.reactiveArgs ?? reactive(storyContext.args); // get reference to reactiveArgs or create a new one;
  // if the story is already rendered and we are not forcing a remount, we just update the reactive args
  if (existingApp && !forceRemount) {
    updateArgs(existingApp.reactiveArgs, storyContext.args);
    return () => {
      teardown(existingApp.vueApp, canvasElement);
    };
  }
  if (existingApp && forceRemount) teardown(existingApp.vueApp, canvasElement);

  // create vue app for the story
  const vueStoryApp = createApp({
    setup() {
      let { args } = storyContext;
      args = reactive(reactiveArgs);
      const rootComponent = storyFn(args);
      map.set(canvasElement, {
        vueApp: vueStoryApp,
        reactiveArgs,
      });
      return () => h(rootComponent, args);
    },
    onMounted() {
      map.set(canvasElement, {
        vueApp: vueStoryApp,
        reactiveArgs,
      });
    },
    renderTracked(event) {
      console.log('--renderTracked ', event);
    },
    renderTriggered(event) {
      console.log('--renderTriggered ', event);
    },
  });
  vueStoryApp.config.errorHandler = (e: unknown) => showException(e as Error);
  setupFunction(vueStoryApp);
  vueStoryApp.mount(canvasElement);

  showMain();
  return () => {
    teardown(vueStoryApp, canvasElement);
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
  const currentArgs = isReactive(reactiveArgs) ? reactiveArgs : reactive(reactiveArgs);
  Object.entries(nextArgs).forEach(([key, value]) => {
    currentArgs[key] = value;
  });
}

function teardown(
  storybookApp: ReturnType<typeof createApp>,
  canvasElement: VueRenderer['canvasElement']
) {
  storybookApp?.unmount();
  if (map.has(canvasElement)) map.delete(canvasElement);
}

/* eslint-disable no-param-reassign */
import { createApp, h, isReactive, reactive, watch } from 'vue';
import type { RenderContext, ArgsStoryFn } from '@storybook/types';
import type { Globals, Args, StoryContext } from '@storybook/csf';
import { global as globalThis } from '@storybook/global';
import type { StoryFnVueReturnType, VueRenderer } from './types';

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
  {
    vueApp: ReturnType<typeof createApp>;
    reactiveArgs: Args;
  }
>();
let reactiveState: {
  globals: Globals;
};
export function renderToCanvas(
  { storyFn, forceRemount, showMain, showException, storyContext, id }: RenderContext<VueRenderer>,
  canvasElement: VueRenderer['canvasElement']
) {
  const existingApp = map.get(canvasElement);

  const reactiveArgs = existingApp?.reactiveArgs ?? reactive(storyContext.args); // get reference to reactiveArgs or create a new one;

  // if the story is already rendered and we are not forcing a remount, we just update the reactive args
  if (existingApp && !forceRemount) {
    if (reactiveState) reactiveState.globals = storyContext.globals;

    updateArgs(existingApp.reactiveArgs, storyContext.args);
    return () => {
      teardown(existingApp.vueApp, canvasElement);
    };
  }
  if (existingApp && forceRemount) teardown(existingApp.vueApp, canvasElement);

  // create vue app for the story
  const vueApp = createApp({
    setup() {
      storyContext.args = reactiveArgs;
      reactiveState = reactive({ globals: storyContext.globals });
      const rootElement: StoryFnVueReturnType = storyFn();

      watch(
        () => reactiveState.globals,
        (newVal) => {
          const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;
          channel.emit('forceRemount', { storyId: id });
        }
      );

      return () => {
        return h(rootElement, reactiveArgs);
      };
    },
    mounted() {
      map.set(canvasElement, {
        vueApp,
        reactiveArgs,
      });
    },
  });
  vueApp.config.errorHandler = (e: unknown) => showException(e as Error);
  setupFunction(vueApp);
  vueApp.mount(canvasElement);

  showMain();
  return () => {
    teardown(vueApp, canvasElement);
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
    .map(([key, value]) => [key, typeof value === 'function' ? value : () => value]);

  return Object.fromEntries(slots);
}

/**
 *  update the reactive args
 * @param reactiveArgs
 * @param nextArgs
 * @returns
 */
export function updateArgs(reactiveArgs: Args, nextArgs: Args, argNames?: string[]) {
  const currentArgs = isReactive(reactiveArgs) ? reactiveArgs : reactive(reactiveArgs);

  Object.keys(currentArgs).forEach((key) => {
    const componentArg = currentArgs[key];
    // if the arg is an object, we need to update the object
    if (typeof componentArg === 'object') {
      Object.keys(componentArg).forEach((key2) => {
        if (nextArgs[key2] && (argNames?.includes(key2) || !argNames)) {
          currentArgs[key][key2] = nextArgs[key2];
        }
      });
      Object.keys(nextArgs).forEach((key2) => {
        if (currentArgs[key][key2] === undefined) {
          currentArgs[key2] = nextArgs[key2];
        }
      });
    } else {
      currentArgs[key] = nextArgs[key];
    }
  });
}
/**
 * unmount the vue app
 * @param storybookApp
 * @param canvasElement
 * @returns void
 * @private
 * */

function teardown(
  storybookApp: ReturnType<typeof createApp>,
  canvasElement: VueRenderer['canvasElement']
) {
  storybookApp?.unmount();
  if (map.has(canvasElement)) map.delete(canvasElement);
}

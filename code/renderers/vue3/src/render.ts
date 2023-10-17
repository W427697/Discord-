/* eslint-disable local-rules/no-uncategorized-errors */
/* eslint-disable no-param-reassign */
import type { App, Component } from 'vue';
import { createApp, h, reactive, isReactive } from 'vue';
import { cloneDeep } from 'lodash';
import type {
  Args,
  VueRenderer,
  StoryID,
  RenderContext,
  StoryContext,
  VueRenderArgsFn,
} from './types';

export const render: VueRenderArgsFn = (props, context) => {
  const { id, component: Component } = context;
  if (!Component) {
    throw new Error(
      `Unable to render story ${id} as the component annotation is missing from the default export`
    );
  }

  return h(Component, props, createOrUpdateSlots(context));
};

export const setup = (fn: (app: App, storyContext?: StoryContext) => unknown) => {
  globalThis.PLUGINS_SETUP_FUNCTIONS ??= new Set();
  globalThis.PLUGINS_SETUP_FUNCTIONS.add(fn);
};

const runSetupFunctions = async (app: App, storyContext: StoryContext): Promise<void> => {
  if (globalThis && globalThis.PLUGINS_SETUP_FUNCTIONS)
    await Promise.all([...globalThis.PLUGINS_SETUP_FUNCTIONS].map((fn) => fn(app, storyContext)));
};

const map = new Map<
  VueRenderer['canvasElement'] | StoryID,
  {
    vueApp: ReturnType<typeof createApp>;
    reactiveArgs: Args;
  }
>();

export async function renderToCanvas(
  { storyFn, forceRemount, showMain, showException, storyContext, id }: RenderContext,
  canvasElement: VueRenderer['canvasElement']
) {
  const existingApp = map.get(canvasElement);

  // if the story is already rendered and we are not forcing a remount, we just update the reactive args
  if (existingApp && !forceRemount) {
    // normally storyFn should be call once only in setup function,but because the nature of react and how storybook rendering the decorators
    // we need to call here to run the decorators again
    // call storyFn to decorate the story with the decorators and prepare it for rendering
    storyFn();
    updateArgs(existingApp.reactiveArgs, storyContext.args);
    return () => {
      teardown(existingApp.vueApp, canvasElement);
    };
  }
  if (existingApp && forceRemount) teardown(existingApp.vueApp, canvasElement);

  const vueApp = createApp({
    setup() {
      storyContext.args = reactive(storyContext.args);
      const story = storyFn(); // call the story function to get the root element with all the decorators

      const appState = {
        vueApp,
        reactiveArgs: reactive(storyContext.args),
      };
      map.set(canvasElement, appState);

      return () => {
        return h(story, appState.reactiveArgs);
      };
    },
  });

  vueApp.config.errorHandler = (e: unknown) => showException(e as Error);
  await runSetupFunctions(vueApp, storyContext);
  vueApp.mount(canvasElement);

  showMain();
  return () => {
    teardown(vueApp, canvasElement);
  };
}

/**
 * generate slots for default story without render function template
 */

function generateSlots(context: StoryContext) {
  const { argTypes } = context;
  const slots = Object.entries(argTypes)
    .filter(([key]) => argTypes[key]?.table?.category === 'slots')
    .map(([key, value]) => [key, !value || typeof value === 'function' ? value : () => value]);

  return Object.fromEntries(slots);
}

/**
 *  update the reactive args
 * @param reactiveArgs
 * @param nextArgs
 * @returns
 */
export function updateArgs(reactiveArgs: Args, nextArgs: Args) {
  if (Object.keys(nextArgs).length === 0) return;
  const currentArgs = isReactive(reactiveArgs) ? reactiveArgs : reactive(reactiveArgs);
  // delete all args in currentArgs that are not in nextArgs
  Object.keys(currentArgs).forEach((key) => {
    if (!(key in nextArgs)) {
      delete currentArgs[key];
    }
  });
  // update currentArgs with nextArgs
  Object.assign(currentArgs, cloneDeep(nextArgs));
}

const slotsMap = new Map<
  StoryID,
  {
    component?: Component;
    reactiveSlots?: Args;
  }
>();

function createOrUpdateSlots(context: StoryContext) {
  const { id: storyID, component } = context;
  const slots = generateSlots(context);
  if (slotsMap.has(storyID)) {
    const app = slotsMap.get(storyID);
    if (app?.reactiveSlots) updateArgs(app.reactiveSlots, slots);
    return app?.reactiveSlots;
  }
  slotsMap.set(storyID, { component, reactiveSlots: slots });
  return slots;
}

/**
 * unmount the vue app
 * @param storybookApp
 * @param canvasElement
 * */

function teardown(
  storybookApp: ReturnType<typeof createApp>,
  canvasElement: VueRenderer['canvasElement']
) {
  storybookApp?.unmount();
  if (map.has(canvasElement)) map.delete(canvasElement);
}

/* eslint-disable no-param-reassign */
import { createApp, h, isReactive, isVNode, reactive, watch } from 'vue';
import type { RenderContext, ArgsStoryFn } from '@storybook/types';
import type {
  Globals,
  Args,
  StoryContext,
  DecoratorFunction,
  PartialStoryFn,
} from '@storybook/csf';

import type { StoryFnVueReturnType, VueRenderer } from './types';
import { updateReactiveContext } from './decorateStory';

export const render: ArgsStoryFn<VueRenderer> = (props, context) => {
  const { id, component: Component } = context;
  if (!Component) {
    throw new Error(
      `Unable to render story ${id} as the component annotation is missing from the default export`
    );
  }

  const slots = generateSlots(context);
  return h(Component, props, slots);
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
  changed: boolean;
};
export function renderToCanvas(
  { storyFn, forceRemount, showMain, showException, storyContext, id }: RenderContext<VueRenderer>,
  canvasElement: VueRenderer['canvasElement']
) {
  const existingApp = map.get(canvasElement);

  const reactiveArgs = existingApp?.reactiveArgs ?? reactive(storyContext.args); // get reference to reactiveArgs or create a new one;

  // if the story is already rendered and we are not forcing a remount, we just update the reactive args
  if (existingApp && !forceRemount) {
    updateGlobals(storyContext);
    updateContextDecorator(storyFn, storyContext);
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
      reactiveState = reactive({ globals: storyContext.globals, changed: false });
      let rootElement: StoryFnVueReturnType = storyFn();

      watch(
        () => reactiveState.globals,
        () => {
          reactiveState.changed = true;
        }
      );

      return () => {
        storyContext.globals = reactiveState.globals;
        rootElement = reactiveState.changed ? storyFn() : rootElement;
        return h(rootElement, reactiveArgs);
      };
    },
    mounted() {
      map.set(canvasElement, {
        vueApp,
        reactiveArgs,
      });
    },
    renderTracked(event) {
      // console.log('vueApp renderTracked', event); // this works only in dev mode
    },
    renderTriggered(event) {
      // console.log('vueApp renderTriggered', event); // this works only in dev mode
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
 * generate slots for default story without render function template
 * @param context
 */

function generateSlots(context: StoryContext<VueRenderer, Args>) {
  const { argTypes } = context;
  const slots = Object.entries(argTypes)
    .filter(([key, value]) => argTypes[key]?.table?.category === 'slots')
    .map(([key, value]) => [
      key,
      () => {
        if (typeof context.args[key] === 'function' || isVNode(context.args[key]))
          return h(context.args[key]);
        if (Array.isArray(context.args[key])) return context.args[key].map((item: any) => h(item));
        if (typeof context.args[key] === 'object') return JSON.stringify(context.args[key]);
        if (typeof context.args[key] === 'string') return context.args[key];
        return context.args[key];
      },
    ]);

  return reactive(Object.fromEntries(slots));
}
/**
 * update vue reactive state for globals to be able to dectect changes and re-render the story
 * @param storyContext
 */
function updateGlobals(storyContext: StoryContext<VueRenderer>) {
  if (reactiveState) {
    reactiveState.changed = false;
    reactiveState.globals = storyContext.globals;
  }
}

/**
 *  update the context args in case of decorators that change args
 * @param storyFn
 * @param storyContext
 */

function updateContextDecorator(
  storyFn: PartialStoryFn<VueRenderer>,
  storyContext: StoryContext<VueRenderer>
) {
  const storyDecorators = storyContext.moduleExport?.decorators;
  if (storyDecorators && storyDecorators.length > 0) {
    storyDecorators.forEach((decorator: DecoratorFunction<VueRenderer>) => {
      try {
        if (typeof decorator === 'function') {
          decorator((update) => {
            if (update) updateReactiveContext(storyContext, update);
            return storyFn();
          }, storyContext);
        }
      } catch (e) {
        console.error(e);
        // in case the decorator throws an error, we need to re-render the story
        // mostly because of react hooks that are not allowed to be called conditionally
        reactiveState.changed = true;
      }
    });
  }
}

/**
 *  update the reactive args
 * @param reactiveArgs
 * @param nextArgs
 * @returns
 */
export function updateArgs(reactiveArgs: Args, nextArgs: Args, argNames?: string[]) {
  if (Object.keys(nextArgs).length === 0) return;
  const currentArgs = isReactive(reactiveArgs) ? reactiveArgs : reactive(reactiveArgs);
  const notMappedArgs = { ...nextArgs };

  Object.keys(currentArgs).forEach((key) => {
    const componentArg = currentArgs[key];
    // if the arg is an object, we need to update the object
    if (typeof componentArg === 'object') {
      Object.keys(componentArg).forEach((aKey) => {
        if (nextArgs[aKey] && (argNames?.includes(aKey) || !argNames)) {
          currentArgs[key][aKey] = nextArgs[aKey];
          delete notMappedArgs[aKey];
          delete notMappedArgs[key];
        }
      });
    } else {
      currentArgs[key] = nextArgs[key];
    }
  });
  Object.keys(notMappedArgs).forEach((key) => {
    currentArgs[key] = notMappedArgs[key];
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

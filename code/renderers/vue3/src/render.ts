/* eslint-disable no-param-reassign */
import { createApp, h, isReactive, reactive, watch } from 'vue';
import type { RenderContext, ArgsStoryFn } from '@storybook/types';
import type {
  Globals,
  Args,
  StoryContext,
  DecoratorFunction,
  PartialStoryFn,
} from '@storybook/csf';

import type { HooksContext } from 'lib/preview-api/src';
import type { StoryFnVueReturnType, VueRenderer } from './types';

export const render: ArgsStoryFn<VueRenderer> = (props, context) => {
  const { id, component: Component } = context;
  if (!Component) {
    throw new Error(
      `Unable to render story ${id} as the component annotation is missing from the default export`
    );
  }

  return h(Component, props, generateSlots(context));
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
      reactiveState = reactive({ globals: storyContext.globals });
      let rootElement: StoryFnVueReturnType = storyFn();

      watch(
        () => reactiveState.globals,
        () => {
          storyContext.globals = reactiveState.globals;
          rootElement = storyFn();
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
        const slotValue = context.args[key];
        return typeof slotValue === 'function' ? h(slotValue) : slotValue;
      },
    ]);

  return reactive(Object.fromEntries(slots));
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
  const storyDecorators: Set<DecoratorFunction<VueRenderer>> = (
    storyContext.hooks as HooksContext<VueRenderer>
  ).mountedDecorators;

  if (storyDecorators && storyDecorators.size > 0) {
    storyDecorators.forEach((decorator: DecoratorFunction<VueRenderer>) => {
      try {
        if (typeof decorator === 'function') {
          decorator((u) => {
            if (u && u.args && !u.globals) return storyFn();
            return () => {};
          }, storyContext);
        }
      } catch (e) {
        // in case the decorator throws an error, we need to re-render the story
        // mostly because of react hooks that are not allowed to be called conditionally
        reactiveState.globals = storyContext.globals; // { ...storyContext.globals };
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
  Object.assign(currentArgs, nextArgs);
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

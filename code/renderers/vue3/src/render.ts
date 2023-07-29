/* eslint-disable no-param-reassign */
import type { App } from 'vue';
import { createApp, h, reactive } from 'vue';

import { mount } from '@vue/test-utils';
import type { VueRenderer, RenderContext, StoryContext, VueRenderArgsFn } from './types';

export const render: VueRenderArgsFn = (props, context) => {
  const { id, component: Component } = context;
  if (!Component) {
    throw new Error(
      `Unable to render story ${id} as the component annotation is missing from the default export`
    );
  }

  return h(Component, props, createOrUpdateSlots(context));
};

// set of setup functions that will be called when story is created
const setupFunctions = new Set<(app: App, storyContext?: StoryContext) => void>();
/** add a setup function to set that will be call when story is created a d
 *
 * @param fn
 */
export const setup = (fn: (app: App, storyContext?: StoryContext) => void) => {
  setupFunctions.add(fn);
};

const runSetupFunctions = (app: App, storyContext: StoryContext) => {
  setupFunctions.forEach((fn) => fn(app, storyContext));
};

let wrapper: ReturnType<typeof mount>;

export function renderToCanvas(
  { storyFn, forceRemount, showMain, showException, storyContext, id }: RenderContext,
  canvasElement: VueRenderer['canvasElement']
) {
  const existingApp = wrapper?.exists(); // && map.get(canvasElement);

  // if the story is already rendered and we are not forcing a remount, we just update the reactive args
  if (existingApp && !forceRemount) {
    // normally storyFn should be call once only in setup function,but because the nature of react and how storybook rendering the decorators
    // we need to call here to run the decorators again
    // call storyFn to decorate the story with the decorators and prepare it for rendering
    storyFn();
    wrapper.setProps(storyContext.args);
    return () => {
      wrapper.unmount();
    };
  }
  if (existingApp && forceRemount) wrapper.unmount();

  const vueApp = createApp({
    setup() {
      storyContext.args = reactive(storyContext.args);
      const story = storyFn(); // call the story function to get the root element with all the decorators

      return () => {
        return h(story);
      };
    },
  });

  vueApp.config.errorHandler = (e: unknown) => showException(e as Error);
  runSetupFunctions(vueApp, storyContext);
  wrapper = mount(vueApp, {
    props: storyContext.args,
    slots: createOrUpdateSlots(storyContext),
    attachTo: canvasElement,
  });

  showMain();
  return () => {
    // teardown(vueApp, canvasElement);
    wrapper.unmount();
  };
}

/**
 * generate slots for default story without render function template
 * @param context
 */

function generateSlots(context: StoryContext) {
  const { argTypes } = context;
  const slots = Object.entries(argTypes)
    .filter(([key, value]) => argTypes[key]?.table?.category === 'slots')
    .map(([key, value]) => {
      const slotValue = context.args[key];
      return [key, typeof slotValue === 'function' ? slotValue : () => slotValue];
    });

  return reactive(Object.fromEntries(slots));
}

function createOrUpdateSlots(context: StoryContext) {
  const slots = generateSlots(context);
  wrapper?.setProps({ slots });
  return slots;
}

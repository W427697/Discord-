import type {
  StoryContext as StoryContextBase,
  WebRenderer,
  RenderContext as RenderContextBase,
  ArgsStoryFn as RenderArgsFn,
} from '@storybook/types';
import type { Args } from '@storybook/csf';

import type { App, Component, h } from 'vue';

export type RenderContext = RenderContextBase<VueRenderer>;
export type { Args };
export type StoryID = string;
export type ArgsStoryFn = RenderArgsFn<VueRenderer, any>; // user uses it in custom render function StoryObj
export type VueRenderArgsFn = (...args: Parameters<ArgsStoryFn>) => ReturnType<typeof h>; //  Vue Renderer render function to render component with  props

export interface ShowErrorArgs {
  title: string;
  description: string;
}

export type StoryFnVueReturnType = ReturnType<typeof h> | Component<any>;

export type StoryContext = StoryContextBase<VueRenderer>;

export type StorybookVueApp = { vueApp: App<any>; storyContext: StoryContext };

/**
 * @deprecated Use `VueRenderer` instead.
 */
export type VueFramework = VueRenderer;
export interface VueRenderer extends WebRenderer {
  // We are omitting props, as we don't use it internally, and more importantly, it completely changes the assignability of meta.component.
  // Try not omitting, and check the type errros in the test file, if you want to learn more.
  component: Component<any>;
  storyResult: StoryFnVueReturnType;
}

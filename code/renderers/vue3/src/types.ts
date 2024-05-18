import {
  type StoryContext as StoryContextBase,
  type WebRenderer,
} from '@storybook/core/dist/types';
import type { App, ConcreteComponent } from 'vue';

export type { RenderContext } from '@storybook/core/dist/types';

export type StoryID = string;

export interface ShowErrorArgs {
  title: string;
  description: string;
}

export type StoryFnVueReturnType = ConcreteComponent<any>;

export type StoryContext = StoryContextBase<VueRenderer>;

export type StorybookVueApp = { vueApp: App<any>; storyContext: StoryContext };

export interface VueRenderer extends WebRenderer {
  // We are omitting props, as we don't use it internally, and more importantly, it completely changes the assignability of meta.component.
  // Try not omitting, and check the type errros in the test file, if you want to learn more.
  component: Omit<ConcreteComponent<this['T']>, 'props'>;
  storyResult: StoryFnVueReturnType;
}

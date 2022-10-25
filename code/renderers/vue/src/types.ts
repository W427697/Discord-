import type { StoryContext as StoryContextBase } from '@storybook/csf';
import type { Component, AsyncComponent } from 'vue';

export type { RenderContext } from '@storybook/core-client';

export interface ShowErrorArgs {
  title: string;
  description: string;
}

export type StoryFnVueReturnType =
  | Component<any, any, any, any>
  | AsyncComponent<any, any, any, any>;

export type StoryContext = StoryContextBase<VueFramework>;

export type VueFramework = {
  component: Component<any, any, any, any> | AsyncComponent<any, any, any, any>;
  storyResult: StoryFnVueReturnType;
};

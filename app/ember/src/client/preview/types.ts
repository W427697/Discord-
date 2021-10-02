import { Args as DefaultArgs } from '@storybook/addons';
import { TemplateFactory } from 'ember-cli-htmlbars';

export type { RenderContext } from '@storybook/core';

export interface ShowErrorArgs {
  title: string;
  description: string;
}

export interface OptionsArgs {
  template: any;
  context: any;
  element: any;
}

export interface StoryFnEmberReturnType<Args = DefaultArgs> {
  template: TemplateFactory;
  context: Args;
}

export type EmberFramework = {
  component: any;
  storyResult: OptionsArgs;
};

import type { ComponentType } from 'react';
import type { WebRenderer } from '@storybook/core/dist/modules/types/index';

export type { RenderContext, StoryContext } from '@storybook/core/dist/modules/types/index';

export interface ReactRenderer extends WebRenderer {
  component: ComponentType<this['T']>;
  storyResult: StoryFnReactReturnType;
}

export interface ShowErrorArgs {
  title: string;
  description: string;
}

export type StoryFnReactReturnType = JSX.Element;

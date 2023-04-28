import type { ComponentType, ReactElement } from 'react';
import type { WebRenderer } from '@junk-temporary-prototypes/types';

export type { RenderContext } from '@junk-temporary-prototypes/types';
export type { StoryContext } from '@junk-temporary-prototypes/types';

/**
 * @deprecated Use `ReactRenderer` instead.
 */
export type ReactFramework = ReactRenderer;
export interface ReactRenderer extends WebRenderer {
  component: ComponentType<this['T']>;
  storyResult: StoryFnReactReturnType;
}

export interface ShowErrorArgs {
  title: string;
  description: string;
}

export type StoryFnReactReturnType = ReactElement<unknown>;

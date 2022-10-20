import type { ComponentType, ReactElement } from 'react';
import type { AnyFramework } from '@storybook/types';

export type { RenderContext } from '@storybook/store';
export type { StoryContext } from '@storybook/types';

export interface ReactFramework extends AnyFramework {
  component: ComponentType<this['T']>;
  storyResult: StoryFnReactReturnType;
}

export interface ShowErrorArgs {
  title: string;
  description: string;
}

export type StoryFnReactReturnType = ReactElement<unknown>;

import {
  AnnotatedStoryFn,
  Args,
  ComponentAnnotations,
  DecoratorFunction,
  LoaderFunction,
  StoryAnnotations,
  StoryContext as GenericStoryContext,
  StrictArgs,
  ProjectAnnotations,
} from '@storybook/types';
import * as AngularCore from '@angular/core';
import { AngularRenderer } from './types';

export type { Args, ArgTypes, Parameters, StrictArgs } from '@storybook/types';
export type { Parameters as AngularParameters } from './types';
export type { AngularRenderer };

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<TArgs = Args> = ComponentAnnotations<
  AngularRenderer,
  TransformComponentType<TArgs>
>;

/**
 * Story function that represents a CSFv2 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryFn<TArgs = Args> = AnnotatedStoryFn<
  AngularRenderer,
  TransformComponentType<TArgs>
>;

/**
 * Story object that represents a CSFv3 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryObj<TArgs = Args> = StoryAnnotations<
  AngularRenderer,
  TransformComponentType<TArgs>
>;

export type Decorator<TArgs = StrictArgs> = DecoratorFunction<AngularRenderer, TArgs>;
export type Loader<TArgs = StrictArgs> = LoaderFunction<AngularRenderer, TArgs>;
export type StoryContext<TArgs = StrictArgs> = GenericStoryContext<AngularRenderer, TArgs>;
export type Preview = ProjectAnnotations<AngularRenderer>;

/**
 * Utility type that transforms InputSignal and EventEmitter types
 */
type TransformComponentType<T> = TransformInputSignalType<TransformEventType<T>>;

type TransformInputSignalType<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Angular < 17.2 doesn't have InputSignal
  [K in keyof T]: T[K] extends AngularCore.InputSignal<infer E>
    ? E
    : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Angular < 17.2 doesn't have InputSignalWithTransform
      T[K] extends AngularCore.InputSignalWithTransform<any, infer U>
      ? U
      : T[K];
};

type TransformEventType<T> = {
  [K in keyof T]: T[K] extends AngularCore.EventEmitter<infer E> ? (e: E) => void : T[K];
};

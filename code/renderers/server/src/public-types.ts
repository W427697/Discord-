import type {
  AnnotatedStoryFn,
  Args,
  ComponentAnnotations,
  StoryAnnotations,
  StoryContext as GenericStoryContext,
  DecoratorFunction,
  LoaderFunction,
  StrictArgs,
  ProjectAnnotations,
} from '@storybook/core/dist/types';
import type { ServerRenderer } from './types';

export type { Args, ArgTypes, Parameters, StrictArgs } from '@storybook/core/dist/types';

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<TArgs = Args> = ComponentAnnotations<ServerRenderer, TArgs>;

/**
 * Story function that represents a CSFv2 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryFn<TArgs = Args> = AnnotatedStoryFn<ServerRenderer, TArgs>;

/**
 * Story object that represents a CSFv3 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryObj<TArgs = Args> = StoryAnnotations<ServerRenderer, TArgs>;

export type { ServerRenderer };
export type Decorator<TArgs = StrictArgs> = DecoratorFunction<ServerRenderer, TArgs>;
export type Loader<TArgs = StrictArgs> = LoaderFunction<ServerRenderer, TArgs>;
export type StoryContext<TArgs = StrictArgs> = GenericStoryContext<ServerRenderer, TArgs>;
export type Preview = ProjectAnnotations<ServerRenderer>;

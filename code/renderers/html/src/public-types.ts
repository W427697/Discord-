import type {
  AnnotatedStoryFn,
  Args,
  ComponentAnnotations,
  DecoratorFunction,
  LoaderFunction,
  StoryAnnotations,
  StoryContext as GenericStoryContext,
  StrictArgs,
  ProjectAnnotations,
} from '@storybook/core/dist/types';
import type { HtmlRenderer } from './types';

export type { Args, ArgTypes, Parameters, StrictArgs } from '@storybook/core/dist/types';
export type { HtmlRenderer };

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<TArgs = Args> = ComponentAnnotations<HtmlRenderer, TArgs>;

/**
 * Story function that represents a CSFv2 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryFn<TArgs = Args> = AnnotatedStoryFn<HtmlRenderer, TArgs>;

/**
 * Story object that represents a CSFv3 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryObj<TArgs = Args> = StoryAnnotations<HtmlRenderer, TArgs>;

export type Decorator<TArgs = StrictArgs> = DecoratorFunction<HtmlRenderer, TArgs>;
export type Loader<TArgs = StrictArgs> = LoaderFunction<HtmlRenderer, TArgs>;
export type StoryContext<TArgs = StrictArgs> = GenericStoryContext<HtmlRenderer, TArgs>;
export type Preview = ProjectAnnotations<HtmlRenderer>;

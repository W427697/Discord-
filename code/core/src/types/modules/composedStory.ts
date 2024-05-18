/* eslint-disable @typescript-eslint/naming-convention */

import type {
  PlayFunction,
  ProjectAnnotations,
  Renderer,
  StoryId,
  StrictArgTypes,
} from '@storybook/csf';

import type {
  AnnotatedStoryFn,
  Args,
  ComponentAnnotations,
  Parameters,
  StoryAnnotations,
  StoryAnnotationsOrFn,
} from './csf';

// TODO -- I think the name "CSFExports" overlaps here a bit with the types in csfFile.ts
// we might want to reconcile @yannbf
export type Store_CSFExports<TRenderer extends Renderer = Renderer, TArgs extends Args = Args> = {
  default: ComponentAnnotations<TRenderer, TArgs>;
  __esModule?: boolean;
  __namedExportsOrder?: string[];
};

/**
 * A story function with partial args, used internally by composeStory
 */
export type PartialArgsStoryFn<TRenderer extends Renderer = Renderer, TArgs = Args> = (
  args?: TArgs
) => (TRenderer & {
  T: TArgs;
})['storyResult'];

type MakeAllParametersOptional<T> = T extends (...args: infer P) => infer R
  ? (...args: { [K in keyof P]?: Partial<P[K]> }) => R
  : never;

export type ComposedStoryPlayFn<
  TRenderer extends Renderer = Renderer,
  TArgs = Args,
> = MakeAllParametersOptional<PlayFunction<TRenderer, Partial<TArgs>>>;
/**
 * A story that got recomposed for portable stories, containing all the necessary data to be rendered in external environments
 */
export type ComposedStoryFn<
  TRenderer extends Renderer = Renderer,
  TArgs = Args,
> = PartialArgsStoryFn<TRenderer, TArgs> & {
  args: TArgs;
  id: StoryId;
  play?: ComposedStoryPlayFn<TRenderer, TArgs>;
  load: () => Promise<void>;
  storyName: string;
  parameters: Parameters;
  argTypes: StrictArgTypes<TArgs>;
};
/**
 * Based on a module of stories, it returns all stories within it, filtering non-stories
 * Each story will have partial props, as their props should be handled when composing stories
 */
export type StoriesWithPartialProps<TRenderer extends Renderer, TModule> = {
  // T represents the whole ES module of a stories file. K of T means named exports (basically the Story type)
  // 1. pick the keys K of T that have properties that are Story<AnyProps>
  // 2. infer the actual prop type for each Story
  // 3. reconstruct Story with Partial. Story<Props> -> Story<Partial<Props>>
  [K in keyof TModule as TModule[K] extends StoryAnnotationsOrFn<infer _, infer _TProps>
    ? K
    : never]: TModule[K] extends StoryAnnotationsOrFn<infer _, infer TProps>
    ? ComposedStoryFn<TRenderer, Partial<TProps>>
    : unknown;
};

/**
 * Type used for integrators of portable stories, as reference when creating their own composeStory function
 */
export interface ComposeStoryFn<TRenderer extends Renderer = Renderer, TArgs extends Args = Args> {
  (
    storyAnnotations: AnnotatedStoryFn<TRenderer, TArgs> | StoryAnnotations<TRenderer, TArgs>,
    componentAnnotations: ComponentAnnotations<TRenderer, TArgs>,
    projectAnnotations: ProjectAnnotations<TRenderer>,
    exportsName?: string
  ): ComposedStoryFn;
}

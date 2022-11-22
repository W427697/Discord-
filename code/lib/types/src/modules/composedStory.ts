/* eslint-disable @typescript-eslint/naming-convention */

import type { Renderer } from '@storybook/csf';

import type {
  AnnotatedStoryFn,
  Args,
  ComponentAnnotations,
  Parameters,
  StoryAnnotations,
  StoryContext,
  StoryFn,
} from './csf';

import type { ProjectAnnotations } from './story';

export type Store_CSFExports<TRenderer extends Renderer = Renderer> = {
  default: ComponentAnnotations<TRenderer, Args>;
  __esModule?: boolean;
  __namedExportsOrder?: string[];
};

export type Store_ComposedStoryPlayContext = Partial<StoryContext> &
  Pick<StoryContext, 'canvasElement'>;

export type Store_ComposedStoryPlayFn = (
  context: Store_ComposedStoryPlayContext
) => Promise<void> | void;

export type PreparedStoryFn<TRenderer extends Renderer = Renderer, TArgs = Args> = AnnotatedStoryFn<
  TRenderer,
  TArgs
> & { play: Store_ComposedStoryPlayFn };

export type Store_ComposedStory<TRenderer extends Renderer = Renderer, TArgs = Args> =
  | StoryFn<TRenderer, TArgs>
  | StoryAnnotations<TRenderer, TArgs>;

/**
 * T represents the whole ES module of a stories file. K of T means named exports (basically the Story type)
 * 1. pick the keys K of T that have properties that are Story<AnyProps>
 * 2. infer the actual prop type for each Story
 * 3. reconstruct Story with Partial. Story<Props> -> Story<Partial<Props>>
 */
export type Store_StoriesWithPartialProps<TRenderer extends Renderer, TModule> = {
  // @TODO once we can use Typescript 4.0 do this to exclude nonStory exports:
  // replace [K in keyof TModule] with [K in keyof TModule as TModule[K] extends ComposedStory<any> ? K : never]
  [K in keyof TModule]: TModule[K] extends Store_ComposedStory<infer _, infer TProps>
    ? AnnotatedStoryFn<TRenderer, Partial<TProps>>
    : unknown;
};

export type Store_ControlsMatchers = {
  date: RegExp;
  color: RegExp;
};

export interface Store_ComposeStory<
  TRenderer extends Renderer = Renderer,
  TArgs extends Args = Args
> {
  (
    storyAnnotations: AnnotatedStoryFn<TRenderer, TArgs> | StoryAnnotations<TRenderer, TArgs>,
    componentAnnotations: ComponentAnnotations<TRenderer, TArgs>,
    projectAnnotations: ProjectAnnotations<TRenderer>,
    exportsName?: string
  ): {
    (extraArgs: Partial<TArgs>): TRenderer['storyResult'];
    storyName: string;
    args: Args;
    play: Store_ComposedStoryPlayFn;
    parameters: Parameters;
  };
}

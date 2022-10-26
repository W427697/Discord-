import type {
  AnnotatedStoryFn,
  Args,
  ArgsFromMeta,
  ArgsStoryFn,
  ComponentAnnotations,
  DecoratorFunction,
  StoryAnnotations,
} from '@storybook/types';

import { ComponentProps, ComponentType, SvelteComponentTyped } from 'svelte';
import { SetOptional, Simplify } from 'type-fest';
import { SvelteFramework } from './types';

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<CmpOrArgs = Args> = CmpOrArgs extends SvelteComponentTyped<infer Props>
  ? ComponentAnnotations<SvelteFramework<CmpOrArgs>, Props>
  : ComponentAnnotations<SvelteFramework, CmpOrArgs>;
/**
 * Story function that represents a CSFv2 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryFn<TArgs = Args> = AnnotatedStoryFn<SvelteFramework, TArgs>;

/**
 * Story function that represents a CSFv3 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryObj<MetaOrCmpOrArgs = Args> = MetaOrCmpOrArgs extends {
  render?: ArgsStoryFn<SvelteFramework, any>;
  component?: ComponentType<infer Component>;
  args?: infer DefaultArgs;
}
  ? Simplify<
      ComponentProps<Component> & ArgsFromMeta<SvelteFramework, MetaOrCmpOrArgs>
    > extends infer TArgs
    ? StoryAnnotations<
        SvelteFramework<Component>,
        TArgs,
        SetOptional<TArgs, Extract<keyof TArgs, keyof DefaultArgs>>
      >
    : never
  : MetaOrCmpOrArgs extends SvelteComponentTyped
  ? StoryAnnotations<
      SvelteFramework<MetaOrCmpOrArgs>,
      ComponentProps<MetaOrCmpOrArgs>,
      ComponentProps<MetaOrCmpOrArgs>
    >
  : StoryAnnotations<SvelteFramework, MetaOrCmpOrArgs>;

export type DecoratorFn<TArgs = Args> = DecoratorFunction<SvelteFramework, TArgs>;

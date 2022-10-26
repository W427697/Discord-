import type {
  AnnotatedStoryFn,
  Args,
  ArgsFromMeta,
  ArgsStoryFn,
  ComponentAnnotations,
  DecoratorFunction,
  StoryAnnotations,
} from '@storybook/types';
import { SetOptional, Simplify } from 'type-fest';
import { Component } from 'vue';
import { ExtendedVue } from 'vue/types/vue';
import { VueFramework } from './types';

export type { Args, ArgTypes, Parameters, StoryContext } from '@storybook/types';

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<CmpOrArgs = Args> = CmpOrArgs extends Component<any>
  ? ComponentAnnotations<
      VueFramework,
      unknown extends ComponentProps<CmpOrArgs> ? CmpOrArgs : ComponentProps<CmpOrArgs>
    >
  : ComponentAnnotations<VueFramework, CmpOrArgs>;

/**
 * Story function that represents a CSFv2 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryFn<TArgs = Args> = AnnotatedStoryFn<VueFramework, TArgs>;

/**
 * Story function that represents a CSFv3 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryObj<MetaOrCmpOrArgs = Args> = MetaOrCmpOrArgs extends {
  render?: ArgsStoryFn<VueFramework, any>;
  component?: infer C;
  args?: infer DefaultArgs;
}
  ? MetaOrCmpOrArgs extends Component<any>
    ? StoryAnnotations<VueFramework, ComponentProps<MetaOrCmpOrArgs>>
    : Simplify<ComponentProps<C> & ArgsFromMeta<VueFramework, MetaOrCmpOrArgs>> extends infer TArgs
    ? StoryAnnotations<
        VueFramework,
        TArgs,
        SetOptional<TArgs, Extract<keyof TArgs, keyof DefaultArgs>>
      >
    : never
  : MetaOrCmpOrArgs extends Component<any>
  ? StoryAnnotations<VueFramework, ComponentProps<MetaOrCmpOrArgs>>
  : StoryAnnotations<VueFramework, MetaOrCmpOrArgs>;

type ComponentProps<C> = C extends ExtendedVue<any, any, any, any, infer P>
  ? P
  : C extends Component<any, any, any, infer P>
  ? P
  : unknown;

/**
 * @deprecated Use `StoryFn` instead.
 * Story function that represents a CSFv2 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type Story<TArgs = Args> = StoryFn<TArgs>;

export type DecoratorFn<TArgs = Args> = DecoratorFunction<VueFramework, TArgs>;

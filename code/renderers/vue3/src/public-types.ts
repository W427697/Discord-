import type {
  Args,
  ComponentAnnotations,
  StoryAnnotations,
  AnnotatedStoryFn,
  ArgsStoryFn,
  ArgsFromMeta,
  DecoratorFunction,
} from '@storybook/types';

import type { SetOptional, Simplify } from 'type-fest';
import type { ComponentOptions, ConcreteComponent, FunctionalComponent } from 'vue';
import type { VueFramework } from './types';

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<CmpOrArgs = Args> = CmpOrArgs extends ComponentOptions<infer Props>
  ? ComponentAnnotations<VueFramework, unknown extends Props ? CmpOrArgs : Props>
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
  component?: infer Component;
  args?: infer DefaultArgs;
}
  ? Simplify<
      ComponentProps<Component> & ArgsFromMeta<VueFramework, MetaOrCmpOrArgs>
    > extends infer TArgs
    ? StoryAnnotations<
        VueFramework,
        TArgs,
        SetOptional<TArgs, Extract<keyof TArgs, keyof DefaultArgs>>
      >
    : never
  : MetaOrCmpOrArgs extends ConcreteComponent<any>
  ? StoryAnnotations<VueFramework, ComponentProps<MetaOrCmpOrArgs>>
  : StoryAnnotations<VueFramework, MetaOrCmpOrArgs>;

type ComponentProps<Component> = Component extends ComponentOptions<infer P>
  ? P
  : Component extends FunctionalComponent<infer P>
  ? P
  : unknown;
/**
 * @deprecated Use `StoryObj` instead.
 * Story function that represents a CSFv3 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type Story<TArgs = Args> = StoryObj<TArgs>;

export type DecoratorFn<TArgs = Args> = DecoratorFunction<VueFramework, TArgs>;

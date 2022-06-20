import { AnnotatedStoryFn, Args, ComponentAnnotations, StoryAnnotations } from '@storybook/csf';
import { ComponentProps, JSXElementConstructor } from 'react';
import { ReactFramework } from './types';

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<TArgs = Args> = ComponentAnnotations<ReactFramework, TArgs>;

/**
 * Story function that represents a CSFv2 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryFn<TArgs = Args> = AnnotatedStoryFn<ReactFramework, TArgs>;

/**
 * Story function that represents a CSFv3 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryObj<TArgs = Args> = StoryAnnotations<ReactFramework, TArgs>;

/**
 * For the common case where a component's stories are simple components that receives args as props:
 *
 * ```tsx
 * export default { ... } as ComponentMeta<typeof Button>;
 * ```
 */
export type ComponentMeta<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
  Meta<ComponentProps<T>>;

/**
 * For the common case where a (CSFv2) story is a simple component that receives args as props:
 *
 * ```tsx
 * const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />
 * ```
 */
export type ComponentStoryFn<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
  StoryFn<ComponentProps<T>>;

/**
 * For the common case where a (CSFv3) story is a simple component that receives args as props:
 *
 * ```tsx
 * const MyStory: ComponentStory<typeof Button> = {
 *   args: { buttonArg1: 'val' },
 * }
 * ```
 */
export type ComponentStoryObj<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
  StoryObj<ComponentProps<T>>;

/**


/**
 * Story function that represents a CSFv3 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type Story<TArgs = Args> = StoryObj<TArgs>;

/**
 * For the common case where a (CSFv3) story is a simple component that receives args as props:
 *
 * ```tsx
 * const MyStory: ComponentStory<typeof Button> = {
 *   args: { buttonArg1: 'val' },
 * }
 * ```
 */ export type ComponentStory<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
  ComponentStoryObj<T>;

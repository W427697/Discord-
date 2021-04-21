import { StoryContext, StoryFn } from '@storybook/addons';
import { DecoratorFunction } from './types';

interface StoryContextUpdate {
  [key: string]: any;
}

const defaultContext: StoryContext = {
  id: 'unspecified',
  name: 'unspecified',
  kind: 'unspecified',
  parameters: {},
  args: {},
  argTypes: {},
  globals: {},
};

/**
 * When you call the story function inside a decorator, e.g.:
 *
 * ```jsx
 * <div>{storyFn({ foo: 'bar' })}</div>
 * ```
 *
 * This will override the `foo` property on the `innerContext`, which gets
 * merged in with the default context
 */
export const decorateStory = (
  storyFn: StoryFn,
  decorator: DecoratorFunction,
  getStoryContext: () => StoryContext
) => {
  // Bind the partially decorated storyFn so that when it is called it always knows about the story context,
  // no matter what it is passed directly. This is because we cannot guarantee a decorator will
  // pass the context down to the next decorator in the chain.
  // (NOTE: You cannot override the parameters key, it is fixed)
  const boundStoryFunction = ({ parameters, ...innerContext }: StoryContextUpdate = {}) =>
    storyFn({ ...getStoryContext(), ...innerContext });

  return (context: StoryContext = defaultContext) => decorator(boundStoryFunction, context);
};

export const defaultDecorateStory = (
  storyFn: StoryFn,
  decorators: DecoratorFunction[],
  getStoryContext: () => StoryContext
) => decorators.reduce((s, d) => decorateStory(s, d, getStoryContext), storyFn);

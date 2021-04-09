import { StoryContext, StoryFn } from '@storybook/addons';
import { first } from 'lodash';
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
 * We cannot guarantee that decorators will pass the context to the next decorator in the chain;
 * To avoid this we could re-bind each decorator with the story context at runtime, but
 * this has problems in e.g. React -- we could create a new SFC each render (see #12255).
 * Instead we use a "global" to track the current story context. This is OK as rendering is
 * syncronous, so we will make it the whole way through the decorator stack before we try
 * rendering any other story.
 */
let currentStoryContext: StoryContext;
// You cannot override the parameters key, it is fixed (we should add to this list)
function overrideStoryContext({ parameters, ...innerContext }: StoryContextUpdate = {}) {
  return { ...currentStoryContext, ...innerContext };
}

/**
 * When you call the story function inside a decorator, e.g.:
 *
 * ```jsx
 * <div>{storyFn({ foo: 'bar' })}</div>
 * ```
 *
 * This will override the `foo` property on the `innerContext`, which gets
 * merged in with the default context, and stored in the `currentStoryContext` "global"
 * to be read by the next decorator
 */
export const decorateStory = (storyFn: StoryFn, decorator: DecoratorFunction) => {
  return (innerContext: StoryContext = defaultContext) => {
    currentStoryContext = overrideStoryContext(innerContext);
    return decorator(storyFn, currentStoryContext);
  };
};

export const defaultDecorateStory = (storyFn: StoryFn, decorators: DecoratorFunction[]) => {
  const decorated = decorators.reduce(decorateStory, (finalInnerStoryContext) =>
    storyFn(overrideStoryContext(finalInnerStoryContext))
  );
  return (firstStoryContext: StoryContext) => {
    // Set the initial story context that is passed into each subsequent decorator
    currentStoryContext = firstStoryContext;
    return decorated(firstStoryContext);
  };
};

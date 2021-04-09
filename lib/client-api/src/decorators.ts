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

let currentStoryContext: StoryContext;
// You cannot override the parameters key, it is fixed
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
 * merged in with the default context
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
    currentStoryContext = firstStoryContext;
    return decorated(firstStoryContext);
  };
};

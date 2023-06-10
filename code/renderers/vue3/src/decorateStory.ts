import type { ConcreteComponent, Component, ComponentOptions } from 'vue';
import { h } from 'vue';
import type { DecoratorFunction, StoryContext, LegacyStoryFn } from '@storybook/types';
import { sanitizeStoryContextUpdate } from '@storybook/preview-api';

import type { VueRenderer } from './types';

/*
  This normalizes a functional component into a render method in ComponentOptions.

  The concept is taken from Vue 3's `defineComponent` but changed from creating a `setup`
  method on the ComponentOptions so end-users don't need to specify a "thunk" as a decorator.
 */

function prepare(
  rawStory: VueRenderer['storyResult'],
  innerStory?: ConcreteComponent
): Component | null {
  const story: Component = rawStory;

  if (!story || typeof story === 'function') {
    return story;
  }

  if (innerStory) {
    return {
      // Normalize so we can always spread an object
      ...story, // we don't to normalize the story if it's a functional component as it's already returned
      components: { ...(story.components || {}), story: innerStory },
    };
  }

  const render = () => h(story);
  return { render };
}

export function decorateStory(
  storyFn: LegacyStoryFn<VueRenderer>,
  decorators: DecoratorFunction<VueRenderer>[]
): LegacyStoryFn<VueRenderer> {
  const decoratedStoryFn = decorators.reduce((decoratedFn, decorator) => {
    const decoratedFunc = (context: StoryContext<VueRenderer>) =>
      decorator((update) => {
        const mergedContext = { ...context, ...sanitizeStoryContextUpdate(update) };
        context.args = mergedContext.args;
        const storyResult = decoratedFn(context);
        return storyResult;
      }, context);

    return (context: StoryContext<VueRenderer>) => {
      const story = decoratedFunc(context);
      const innerStory = () => h(story, context.args);
      return prepare(story, innerStory) as VueRenderer['storyResult'];
    };
  }, storyFn);

  return (context: StoryContext<VueRenderer>) => {
    const story = decoratedStoryFn(context);
    story.inheritAttrs ??= context.parameters.inheritAttrs ?? false;
    return prepare(story) as LegacyStoryFn<VueRenderer>;
  };
}

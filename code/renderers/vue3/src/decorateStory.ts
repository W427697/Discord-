import type { Component, ComponentOptions, ConcreteComponent } from 'vue';
import { h } from 'vue';
import type { DecoratorFunction, LegacyStoryFn, StoryContext } from '@storybook/types';
import { sanitizeStoryContextUpdate } from '@storybook/preview-api';
import type { VueRenderer } from './types';

/*
  This normalizes a functional component into a render method in ComponentOptions.

  The concept is taken from Vue 3's `defineComponent` but changed from creating a `setup`
  method on the ComponentOptions so end-users don't need to specify a "thunk" as a decorator.
 */

function normalizeFunctionalComponent(options: ConcreteComponent): ComponentOptions {
  return typeof options === 'function' ? { render: options, name: options.name } : options;
}

function prepare(
  rawStory: VueRenderer['storyResult'],
  innerStory?: ConcreteComponent
): Component | null {
  const story = rawStory as ComponentOptions;

  if (story === null) {
    return null;
  }
  if (typeof story === 'function') return story; // we don't need to wrap a functional component nor to convert it to a component options
  const normalizedStory = { ...normalizeFunctionalComponent(story), inheritAttrs: false };
  if (innerStory) {
    return {
      // Normalize so we can always spread an object
      ...normalizedStory,
      components: { ...(story.components || {}), story: innerStory },
    };
  }
  return {
    render() {
      return h(normalizedStory);
    },
  };
}

export function decorateStory(
  storyFn: LegacyStoryFn<VueRenderer>,
  decorators: DecoratorFunction<VueRenderer>[]
): LegacyStoryFn<VueRenderer> {
  const decoratedStoryFn = decorators.reduce((decoratedFn, decorator) => {
    let storyResult: VueRenderer['storyResult'];

    const decoratedStory = (context: StoryContext<VueRenderer>) =>
      decorator((update) => {
        const mergedContext = { ...context, ...sanitizeStoryContextUpdate(update) };
        storyResult = decoratedFn(mergedContext);
        context.args = mergedContext.args;
        return storyResult;
      }, context);

    return (context: StoryContext<VueRenderer>) => {
      const story = decoratedStory(context);
      if (!storyResult) storyResult = decoratedFn(context);
      if (story === storyResult) return story;
      return prepare(story, () => h(storyResult, context.args)) as VueRenderer['storyResult'];
    };
  }, storyFn);

  return (context: StoryContext<VueRenderer>) =>
    prepare(decoratedStoryFn(context)) as LegacyStoryFn<VueRenderer>;
}

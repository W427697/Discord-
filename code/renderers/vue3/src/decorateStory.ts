import type { ConcreteComponent, Component, ComponentOptions } from 'vue';
import { h } from 'vue';
import type { DecoratorFunction, StoryContext, LegacyStoryFn } from '@storybook/types';
import { sanitizeStoryContextUpdate } from '@storybook/preview-api';

import type { VueRenderer } from './types';
import { updateArgs } from './render';

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
  if (innerStory) {
    return {
      // Normalize so we can always spread an object
      ...normalizeFunctionalComponent(story),
      components: { ...(story.components || {}), story: innerStory },
    };
  }
  return {
    render() {
      return h(story);
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

  return (context: StoryContext<VueRenderer>) => {
    const story = decoratedStoryFn(context);
    return prepare(story) as LegacyStoryFn<VueRenderer>;
  };
}

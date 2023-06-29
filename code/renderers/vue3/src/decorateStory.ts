import type { Component } from 'vue';
import { h, isVNode } from 'vue';
import { sanitizeStoryContextUpdate } from '@storybook/preview-api';
import type { StoryContext, StoryFnVueReturnType } from './types';
import type { LegacyStoryFn, Decorator } from './public-types';

function prepare(story: StoryFnVueReturnType, innerStory?: StoryFnVueReturnType): Component {
  if (story === null) {
    return () => null;
  }
  if (typeof story === 'function') return story; // we don't need to wrap a functional component nor to convert it to a component options

  const storyComponent = {
    render() {
      return h(story);
    },
    inheritAttrs: false,
  };

  if (innerStory) {
    return {
      ...storyComponent,
      components: { story: (args) => h(innerStory, args) },
    };
  }
  return storyComponent;
}

export function decorateStory(storyFn: LegacyStoryFn, decorators: Decorator[]) {
  const decoratedStoryFn = decorators.reduce((decorated, decorator) => {
    let storyResult: StoryFnVueReturnType;

    const decoratedStory = (context: StoryContext) =>
      decorator((update) => {
        const mergedContext = { ...context, ...sanitizeStoryContextUpdate(update) };
        storyResult = decorated(mergedContext);
        context.args = mergedContext.args;
        return storyResult;
      }, context);

    return (context: StoryContext) => {
      const story = decoratedStory(context);
      if (!storyResult) storyResult = decorated(context);
      if (!story || !isVNode(storyResult)) return storyResult;
      if (story === storyResult) return storyResult;

      return prepare(story, h(storyResult, context.args));
    };
  }, storyFn);

  return (context: StoryContext) => prepare(decoratedStoryFn(context));
}

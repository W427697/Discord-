import type { ConcreteComponent, Component, ComponentOptions } from 'vue';
import { isVNode, h } from 'vue';
import type { DecoratorFunction, StoryContext, LegacyStoryFn } from '@storybook/types';
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
  console.log('prepare-> rawStory :', story);
  if (story === null) {
    return null;
  }
  if (typeof story === 'function') return story;
  if (innerStory) {
    // we don't need to wrap a functional component nor to convert it to a component options
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
  return decorators.reduce(
    (decorated: LegacyStoryFn<VueRenderer>, decorator) => (context: StoryContext<VueRenderer>) => {
      let story: VueRenderer['storyResult'] = { isNull: true };
      const decoratedStory: VueRenderer['storyResult'] = decorator((update) => {
        story = decorated({
          ...context,
          ...sanitizeStoryContextUpdate(update),
        });
        const argsChanged =
          update && update.args && Object.keys(update).length === 1 && !isVNode(story);
        // TODO: this is a hack to avoid re-rendering the story when the args are not changed
        // we should find a better way to do this
        // i should get only update = { args: { ...context.args, text:... } } from the decorator and not the whole context
        if (argsChanged) {
          story = h(story, update.args);
        }
        return story;
      }, context);

      console.log('-1--story---', story);

      if (story.isNull) story = decorated(context);

      console.log('--2-story---', story);
      console.log('--3-decoratedStory---', decoratedStory, '\n');

      if (decoratedStory === story) {
        return story;
      }

      const props = story.props ?? context.args;
      const innerStory = () => h(story, props);
      return prepare(decoratedStory, innerStory) as VueRenderer['storyResult'];
    },
    (context) => {
      const rawStory = storyFn(context);
      console.log('rawStory :', rawStory);
      return prepare(rawStory) as LegacyStoryFn<VueRenderer>;
    }
  );
}

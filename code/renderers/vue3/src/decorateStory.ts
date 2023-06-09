import type { ConcreteComponent, Component, ComponentOptions } from 'vue';
import { reactive, h } from 'vue';
import type { DecoratorFunction, StoryContext, LegacyStoryFn, Args } from '@storybook/types';
import { sanitizeStoryContextUpdate } from '@storybook/preview-api';

import type { VueRenderer } from './types';
import { updateArgs } from './render';

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
  const updatedArgs: Args = reactive({});

  return decorators.reduce(
    (decorated: LegacyStoryFn<VueRenderer>, decorator) => (context: StoryContext<VueRenderer>) => {
      let story: VueRenderer['storyResult'] | undefined;

      const decoratedStory: VueRenderer['storyResult'] = decorator((update) => {
        story = decorated({
          ...context,
          ...sanitizeStoryContextUpdate(update),
        });

        if (
          update &&
          update.args &&
          Object.keys(update).length === 1 &&
          Object.keys(updateArgs).length === 0
        ) {
          updateArgs(updatedArgs, update.args);
        }
        return story;
      }, context);

      updateArgs(context.args, updatedArgs);

      if (!story) story = decorated(context);

      if (decoratedStory === story) {
        return story;
      }

      const innerStory = () => h(story!, context.args);
      return prepare(decoratedStory, innerStory) as VueRenderer['storyResult'];
    },
    (context) => {
      const story = storyFn(context);
      story.inheritAttrs ??= context.parameters.inheritAttrs ?? false;
      return prepare(story) as LegacyStoryFn<VueRenderer>;
    }
  );
}

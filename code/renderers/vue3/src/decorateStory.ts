import type { ConcreteComponent, Component, ComponentOptions } from 'vue';
import { reactive, h } from 'vue';
import type { DecoratorFunction, StoryContext, LegacyStoryFn } from '@storybook/types';
import { sanitizeStoryContextUpdate } from '@storybook/preview-api';

import type { Args, StoryContextUpdate } from '@storybook/csf';
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
  const story = normalizeFunctionalComponent(rawStory as ComponentOptions);

  if (story == null) {
    return null;
  }

  if (innerStory) {
    return {
      // Normalize so we can always spread an object
      ...normalizeFunctionalComponent(story),
      components: { ...(story.components || {}), story: innerStory },
      renderTracked(event) {
        console.log('innerStory renderTracked', event); // this works only in dev mode
      },
      renderTriggered(event) {
        console.log('innerStory renderTriggered', event);
      },
    };
  }

  return {
    render() {
      return h(story);
    },
    renderTracked(event) {
      console.log('story renderTracked', event); // this works only in dev mode
    },
    renderTriggered(event) {
      console.log('story renderTriggered', event);
    },
  };
}

export function decorateStory(
  storyFn: LegacyStoryFn<VueRenderer>,
  decorators: DecoratorFunction<VueRenderer>[]
): LegacyStoryFn<VueRenderer> {
  return decorators.reduce(
    (decorated: LegacyStoryFn<VueRenderer>, decorator) => (context: StoryContext<VueRenderer>) => {
      let story: VueRenderer['storyResult'] | undefined;

      const decoratedStory: VueRenderer['storyResult'] = decorator((update) => {
        // we should update the context with the update object from the decorator in reactive way
        // so that the story will be re-rendered with the new context
        story = decorated({
          ...context,
          ...sanitizeStoryContextUpdate(update),
        });
        if (update) updateReactiveContext(context, update);
        return story;
      }, context);

      if (!story) {
        story = decorated(context);
      }

      if (decoratedStory === story) {
        return story;
      }

      const storyFuntion = () => h(story ?? 'story', context.args);
      return prepare(decoratedStory, storyFuntion) as VueRenderer['storyResult'];
    },
    (context) => prepare(storyFn(context)) as LegacyStoryFn<VueRenderer>
  );
}
/**
 * update the context with the update object from the decorator in reactive way
 * @param context
 * @param update
 */
function updateReactiveContext(
  context: StoryContext<VueRenderer>,
  update: StoryContextUpdate<Partial<Args>> | undefined
) {
  context.args = reactive(context.args); // get reference to reactiveArgs or create a new one; in case was destructured by decorator
  if (update) {
    const { args, argTypes } = update;
    if (args && !argTypes) {
      const deepCopy = JSON.parse(JSON.stringify(args)); // avoid reference to args
      Object.keys(context.args).forEach((key) => {
        delete context.args[key];
      });
      Object.keys(args).forEach((key) => {
        context.args[key] = deepCopy[key];
      });
    }
  }
}

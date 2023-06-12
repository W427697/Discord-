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
/**
 * This function takes a rawStory (as returned by the storyFn), and an innerStory (optional),
 * which is used to render child components and returns a Component object.
 * If an innerStory is provided, it merges the components object of the story with the components object for the innerStory.
 *
 * @param {VueRenderer['storyResult']} rawStory - The rawStory returned by the storyFn.
 * @param {ConcreteComponent} innerStory - Optional innerStory used for rendering child components.
 * @returns {Component | null} - Returns a Component object that can be rendered.
 */
function prepare(story: VueRenderer['storyResult'], innerStory?: Component): Component | null {
  if (!story) {
    return null;
  }

  // If story is already a function, we don't need to wrap it nor convert it
  if (typeof story === 'function') return story;

  // Normalize the functional component, and make sure inheritAttrs is set to false
  const normalizedStory = { ...normalizeFunctionalComponent(story), inheritAttrs: false };

  // If an innerStory is provided, merge its components object with story.components
  if (innerStory) {
    return {
      ...normalizedStory,
      components: { ...(story.components || {}), story: innerStory },
    };
  }

  // Return a Component object with a render function that returns the normalizedStory
  return {
    render() {
      return h(normalizedStory);
    },
  };
}

/**
 * This function takes a storyFn and an array of decorators, and returns a decorated version of the input storyFn.
 *
 * @param {LegacyStoryFn<VueRenderer>} storyFn - The story function to decorate.
 * @param {DecoratorFunction<VueRenderer>[]} decorators - The array of decorators to apply to the story function.
 * @returns {LegacyStoryFn<VueRenderer>} - Returns a decorated version of the input storyFn.
 */
export function decorateStory(
  storyFn: LegacyStoryFn<VueRenderer>,
  decorators: DecoratorFunction<VueRenderer>[]
): LegacyStoryFn<VueRenderer> {
  /**
   * This function receives two arguments: accuDecoratedStoryFn (the accumulator for the decorated story function) and currentDecoratorFn (the current decorator function).
   * It applies the decorator to the accuDecoratedStoryFn by returning a new decorated storyFn from the currentDecoratedStory function.
   *
   * @param {LegacyStoryFn<VueRenderer>} accuDecoratedStoryFn - The accumulator of the decorated story function.
   * @param {DecoratorFunction<VueRenderer>} currentDecoratorFn - The current decorator function.
   */
  const finalDecoratedStoryFn = decorators.reduce((accuDecoratedStoryFn, currentDecoratorFn) => {
    let storyResult: VueRenderer['storyResult'];

    /**
     * This function receives a context argument (the current context of the story function),
     * and returns a decorated version of the story function.
     *
     * @param {StoryContext<VueRenderer>} context - The current context of the story function.
     */
    const currentDecoratedStory = (context: StoryContext<VueRenderer>) =>
      currentDecoratorFn((update) => {
        const mergedContext = { ...context, ...sanitizeStoryContextUpdate(update) };
        storyResult = accuDecoratedStoryFn(mergedContext);
        context.args = mergedContext.args;
        return storyResult;
      }, context);

    /**
     * This function receives a context argument (the current context of the story function),
     * and returns the final decorated story function with all the decorators applied
     * @param {StoryContext<VueRenderer>} context - The current context of the story function.
     * @returns {VueRenderer['storyResult']} - Returns the final decorated story function with all the decorators applied.
     */
    return (context: StoryContext<VueRenderer>) => {
      const story = currentDecoratedStory(context);
      if (!storyResult) storyResult = accuDecoratedStoryFn(context);
      if (!story) return storyResult;
      if (story === storyResult) return storyResult;

      return prepare(story, () => h(storyResult, context.args)) as VueRenderer['storyResult'];
    };
  }, storyFn);
  /**
   * This function receives a context argument (the current context of the story function), and returns the final decorated story function with all the decorators applied.
   *
   * @param {StoryContext<VueRenderer>} context - The current context of the story function.
   * @returns {LegacyStoryFn<VueRenderer>} - Returns the final decorated story function with all the decorators applied.
   */
  return (context: StoryContext<VueRenderer>) =>
    prepare(finalDecoratedStoryFn(context)) as LegacyStoryFn<VueRenderer>;
}

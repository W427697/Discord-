import type { DecoratorFunction, StoryContext, LegacyStoryFn } from '@storybook/types';
import { sanitizeStoryContextUpdate } from '@storybook/preview-api';
import { SvelteComponent } from 'svelte';
import type { SvelteRenderer } from './types';

/**
 * Check if an object is a svelte component.
 * @param obj Object
 */
function isSvelteComponent(obj: any) {
  return Object.prototype.isPrototypeOf.call(obj, SvelteComponent);
  return obj.prototype && obj.prototype.$destroy !== undefined;
}

/**
 * Handle component loaded with esm or cjs.
 * @param obj object
 */
function unWrap(obj: any) {
  return obj && obj.default ? obj.default : obj;
}

/**
 * Transform a story to be compatible with the PreviewRender component.
 *
 * - `() => MyComponent` is translated to `() => ({ Component: MyComponent })`
 * - `() => ({})` is translated to `() => ({ Component: <from context.component> })`
 * - A decorator component is wrapped with SlotDecorator. The decorated component is inject through
 * a <slot/>
 *
 * @param context StoryContext
 * @param story  the current story
 * @param originalStory the story decorated by the current story
 */
function prepareStory(context: StoryContext<SvelteRenderer>, story: any, originalStory?: any) {
  let result = unWrap(story);
  console.log('LOG: result', result);
  if (!result.Component) {
    console.log('LOG: isSvelteComponent');
    // wrap the component
    result = {
      Component: result,
    };
  }

  if (originalStory) {
    console.log('LOG: originalStory', originalStory);
    // inject the new story as a wrapper of the original story
    result = {
      Component: unWrap(originalStory.Component),
      props: originalStory.props,
      on: originalStory.on,
      decorator: unWrap(result.Component),
      decoratorProps: result.props,
    };
  } else {
    console.log('LOG: NOT originalStory', result, context.component);
    result.Component = unWrap(result.Component || context.component);
  }
  return result;
}

export function decorateStory(storyFn: any, decorators: any[]) {
  return decorators.reduce(
    (
        previousStoryFn: LegacyStoryFn<SvelteRenderer>,
        decorator: DecoratorFunction<SvelteRenderer>
      ) =>
      (context: StoryContext<SvelteRenderer>) => {
        let story;
        const decoratedStory = decorator((update) => {
          story = previousStoryFn({
            ...context,
            ...sanitizeStoryContextUpdate(update),
          });
          return story;
        }, context);

        if (!story) {
          story = previousStoryFn(context);
        }

        if (!decoratedStory || decoratedStory === story) {
          return story;
        }

        return prepareStory(context, decoratedStory, story);
      },
    (context: StoryContext<SvelteRenderer>) => prepareStory(context, storyFn(context))
  );
}

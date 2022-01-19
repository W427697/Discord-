/* eslint no-param-reassign: ["error", { "props": false }], consistent-return: "off" */

import { StoryContext } from '@storybook/csf';
import { addons, useEffect } from '@storybook/addons';
import { logger } from '@storybook/client-logger';
import { VueFramework } from '@storybook/vue3';
import { getCurrentInstance, ComponentInternalInstance } from '@vue/runtime-core';

import { renderSnippet } from './snippetRenderer';

import { SourceType, SNIPPET_RENDERED } from '../../shared';

// TODO: Tests (see ../vue/sourceDecorator.test.ts)

export const skipSourceRender = (context: StoryContext<VueFramework>) => {
  const sourceParams = context?.parameters.docs?.source;
  const isArgsStory = context?.parameters.__isArgsStory;

  // always render if the user forces it
  if (sourceParams?.type === SourceType.DYNAMIC) {
    return false;
  }

  // never render if the user is forcing the block to render code, or
  // if the user provides code, or if it's not an args story.
  return !isArgsStory || sourceParams?.code || sourceParams?.type === SourceType.CODE;
};

export const sourceDecorator = (storyFn: any, context: StoryContext<VueFramework>) => {
  const story = storyFn();
  const skip = skipSourceRender(context);

  let snippet = '';

  useEffect(() => {
    if (!skip) {
      channel.emit(SNIPPET_RENDERED, (context || {}).id, snippet);
    }
  });

  // See ../react/jsxDecorator.tsx
  if (skipSourceRender(context)) {
    return story;
  }

  const channel = addons.getChannel();

  return {
    components: {
      Story: story,
    },
    // We need to wait until the wrapper component to be mounted so Vue runtime generate a VNode tree.
    mounted() {
      try {
        const storyComponent = lookupStoryInstance(getCurrentInstance());
        if (!storyComponent) {
          return;
        }

        snippet = renderSnippet(storyComponent, {});

        return;
      } catch (e) {
        logger.warn(`Failed to generate dynamic story source: ${e}`);
      }
    },
    template: '<story />',
  };
};

/**
 * Traverse component instance and returns the story's one.
 * Returns `null` when unable to find story instance.
 *
 * FIXME: This does not work with CSF3, possibly due to the difference of component hierarchy
 * FIXME: More stable and reliable solution needed
 *
 * # How to detect story component?
 *
 * When a component instance has `story` component inside `components` registry,
 * that is an component instance of a decorator. Slotted instance without `story`
 * component registered is the story user wrote.
 */
function lookupStoryInstance(
  instance: ComponentInternalInstance
): ComponentInternalInstance | null {
  if (
    typeof instance.type === 'object' &&
    'components' in instance.type &&
    instance.type.components &&
    'story' in instance.type.components
  ) {
    if (!instance.subTree.component) {
      // This is the final decorator. Now, grab the user story.
      const storyComponent = instance.type.components.story;

      if (Array.isArray(instance.subTree.children)) {
        const found = instance.subTree.children.find((child) => {
          if (typeof child === 'object' && 'type' in child) {
            return child.component.type === storyComponent;
          }

          return false;
        });

        return Array.isArray(found) || typeof found !== 'object' ? null : found.component;
      }

      return null;
    }

    // Now, the `instance.subTree` is VNode of decorator. Dig one-level deeper.
    return lookupStoryInstance(instance.subTree.component);
  }

  // No decorators
  return instance;
}

import { BoundStory } from '@storybook/store';
import { StoryContext } from '@storybook/csf';
import Vue from 'vue';

import { VueFramework } from '@storybook/vue';
import { getSnippet } from '../../blocks/getSnippet';
import { skipSourceRender, storyResultToSnippet } from './sourceDecorator';

export const extractSnippet = async (
  story: BoundStory<VueFramework>,
  context: StoryContext<VueFramework>
) => {
  if (skipSourceRender(context)) {
    return getSnippet('', story);
  }

  const storyResult = story.storyFn();

  // Mounting vue component is a costly operation, but we need to do it to get the snippet.
  // TODO: We should be able to get the snippet without mounting the component.
  const vm = new Vue({
    data() {
      return {
        STORYBOOK_VALUES: context.args,
      };
    },
    render(h) {
      return h(storyResult);
    },
  }).$mount();

  const storySnippet = await storyResultToSnippet(storyResult, vm);

  return getSnippet(storySnippet, story);
};

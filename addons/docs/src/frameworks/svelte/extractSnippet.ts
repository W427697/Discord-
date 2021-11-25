import { BoundStory } from '@storybook/store';
import { ArgsStoryFn, StoryContext } from '@storybook/csf';

import { getSnippet } from '../../blocks/getSnippet';
import { skipSourceRender, storyResultToSnippet } from './sourceDecorator';

export const extractSnippet = (story: BoundStory, context: StoryContext) => {
  if (skipSourceRender(context)) {
    return getSnippet('', story);
  }

  const storyResult = (context.originalStoryFn as ArgsStoryFn)(context.args, context);

  const storySnippet = storyResultToSnippet(storyResult, context);

  return getSnippet(storySnippet, story);
};

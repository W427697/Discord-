import { StoryContext, AngularFramework } from '@storybook/angular';
import { BoundStory } from '@storybook/store';
import { ArgsStoryFn } from '@storybook/csf';

import { skipSourceRender, storyResultToSnippet } from './sourceDecorator';
import { getSnippet } from '../../blocks/getSnippet';

export const extractSnippet = async (
  story: BoundStory<AngularFramework>,
  context: StoryContext
) => {
  if (skipSourceRender(context)) {
    return getSnippet('', story);
  }

  const storyResult = (context.originalStoryFn as ArgsStoryFn<AngularFramework>)(
    context.args,
    context
  );

  const storySnippet = await storyResultToSnippet(storyResult, context);
  return getSnippet(storySnippet, story);
};

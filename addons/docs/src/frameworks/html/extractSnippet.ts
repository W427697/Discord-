import { BoundStory } from '@storybook/store';
import { ArgsStoryFn, StoryContext } from '@storybook/csf';
import { HtmlFramework } from '@storybook/html';

import { getSnippet } from '../../blocks/getSnippet';
import { skipSourceRender, storyResultToSnippet } from './sourceDecorator';

export const extractSnippet = (
  story: BoundStory<HtmlFramework>,
  context: StoryContext<HtmlFramework>
) => {
  if (skipSourceRender(context)) {
    return getSnippet('', story);
  }

  const storyResult = (context.originalStoryFn as ArgsStoryFn<HtmlFramework>)(
    context.args,
    context
  );

  const storySnippet = storyResultToSnippet(storyResult, context);

  return getSnippet(storySnippet, story);
};

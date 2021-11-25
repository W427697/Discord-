import { BoundStory } from '@storybook/store';
import { ArgsStoryFn, StoryContext } from '@storybook/csf';
import { WebComponentsFramework } from '@storybook/web-components';

import { getSnippet } from '../../blocks/getSnippet';
import { skipSourceRender, storyResultToSnippet } from './sourceDecorator';

export const extractSnippet = (
  story: BoundStory<WebComponentsFramework>,
  context: StoryContext<WebComponentsFramework>
) => {
  if (skipSourceRender(context)) {
    return getSnippet('', story);
  }

  const storyResult = (context.originalStoryFn as ArgsStoryFn<WebComponentsFramework>)(
    context.args,
    context
  );

  const storySnippet = storyResultToSnippet(storyResult, context);

  return getSnippet(storySnippet, story);
};

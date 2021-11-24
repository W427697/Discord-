import { ReactFramework } from '@storybook/react';

import { BoundStory } from '@storybook/store';
import { ArgsStoryFn, StoryContext } from '@storybook/csf';
import { jsxToSnippet, skipJsxRender } from './jsxDecorator';
import { getSnippet } from '../../blocks/getSnippet';

export const extractSnippet = (
  story: BoundStory<ReactFramework>,
  context: StoryContext<ReactFramework>
) => {
  if (skipJsxRender(context)) {
    return getSnippet('', story);
  }

  const jsx = (context.originalStoryFn as ArgsStoryFn<ReactFramework>)(context.args, context);

  const storySnippet = jsxToSnippet(jsx, context);
  return getSnippet(storySnippet, story);
};

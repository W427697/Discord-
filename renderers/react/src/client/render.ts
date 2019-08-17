import { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { stripIndents } from 'common-tags';
import { StoryContext } from '@storybook/addons';

import isReactRenderable from './element_check';

type StoryError = Error & { description?: string };

export default function render(
  element: ReactNode,
  container: Element,
  context: Partial<StoryContext>
) {
  if (!element) {
    const error: StoryError = new Error(
      `Expecting a React element from the story: "${context.name}" of "${context.kind}".`
    );
    error.description = stripIndents`
      Did you forget to return the React element from the story?
      Use "() => (<MyComp/>)" or "() => { return <MyComp/>; }" when defining the story.
    `;
    throw error;
  }

  if (!isReactRenderable(element)) {
    const error: StoryError = new Error(
      `Expecting a valid React element from the story: "${context.name}" of "${context.kind}".`
    );
    error.description = stripIndents`
      Seems like you are not returning a correct React element from the story.
      Could you double check that?
    `;
    throw error;
  }

  return new Promise(resolve => {
    // @ts-ignore https://github.com/DefinitelyTyped/DefinitelyTyped/pull/35898
    ReactDOM.render(element, container, resolve);
  });
}

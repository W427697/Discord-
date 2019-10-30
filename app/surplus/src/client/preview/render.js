/* global Node */

import { document } from 'global';
import dedent from 'ts-dedent';
import S from 's-js';

export default function render({
  storyFn,
  selectedKind,
  selectedStory,
  showMain,
  showError,
  showException,
}) {
  let element = null;
  try {
    element = S.root(storyFn);
  } catch (err) {
    showException(err);
    return;
  }

  if (!element || !(element instanceof Node)) {
    showError({
      title: `Encountered an invalid value returned from a Surplus story: "${selectedStory}" of "${selectedKind}".`,
      description: dedent`
        Are you returning a Surplus element from your story?
        Use "export const myStory = () => (<div>Your Component</div>)"
        when defining the story.
      `,
    });

    return;
  }

  const target = document.getElementById('root');

  target.innerHTML = '';
  target.appendChild(element);

  showMain();
}

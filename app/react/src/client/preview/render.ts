import { document } from 'global';

import { RenderMainArgs } from './types';

const rootElement = document ? document.getElementById('root') : null;

export default async function renderMain({ storyFn, showMain, forceRender }: RenderMainArgs) {
  const element = await storyFn();

  showMain();
  // Don't re-mount the element if it didn't change and neither did the story
  if (rootElement.firstChild === element && forceRender === true) {
    return;
  }

  rootElement.innerHTML = '';
  rootElement.appendChild(element);
}

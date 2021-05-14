/* eslint-disable no-param-reassign */
import { document, Node } from 'global';
import dedent from 'ts-dedent';
import { render, TemplateResult } from 'lit-html';
import { simulatePageLoad, simulateDOMContentLoaded } from '@storybook/client-api';
import { RenderContext } from './types';

const rootElement = document.getElementById('root');

export default function renderMain({
  storyFn,
  kind,
  name,
  showError,
  forceRender,
  targetDOMNode = rootElement,
}: RenderContext) {
  const element = storyFn();

  if (element instanceof TemplateResult) {
    // `render` stores the TemplateInstance in the Node and tries to update based on that.
    // Since we reuse `rootElement` for all stories, remove the stored instance first.
    // But forceRender means that it's the same story, so we want too keep the state in that case.
    if (!forceRender || !rootElement.querySelector('[id="root-inner"]')) {
      targetDOMNode.innerHTML = '<div id="root-inner"></div>';
    }
    const renderTo = targetDOMNode.querySelector('[id="root-inner"]');

    render(element, renderTo);
    simulatePageLoad(targetDOMNode);
  } else if (typeof element === 'string') {
    targetDOMNode.innerHTML = element;
    simulatePageLoad(targetDOMNode);
  } else if (element instanceof Node) {
    // Don't re-mount the element if it didn't change and neither did the story
    if (targetDOMNode.firstChild === element && forceRender === true) {
      return;
    }

    targetDOMNode.innerHTML = '';
    targetDOMNode.appendChild(element);
    simulateDOMContentLoaded();
  } else {
    showError({
      title: `Expecting an HTML snippet or DOM node from the story: "${name}" of "${kind}".`,
      description: dedent`
        Did you forget to return the HTML snippet from the story?
        Use "() => <your snippet or node>" or when defining the story.
      `,
    });
  }
}

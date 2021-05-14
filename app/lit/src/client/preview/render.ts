import { document } from 'global';
import dedent from 'ts-dedent';
import { render } from 'lit';
import { isTemplateResult } from 'lit/directive-helpers.js';
import { RenderContext } from './types';

const rootElement = document.getElementById('root');

export default function renderMain({
  storyFn,
  kind,
  name,
  showError,
  targetDOMNode = rootElement,
}: RenderContext) {
  const element = storyFn();

  if (targetDOMNode === null) {
    return;
  }

  // in docs-mode we initially render a placeholder, lit will NOT replace it, but rather render BELOW
  // We clear out the loading-indicator, lit however will not render a second time if we cleared the contents.
  // So we detect if our loading-indicator exists, and if it does, we clear the contents
  // nodeType 8 is a html-comment, which is what lit injects, so I use that to detect if lit has rendered
  if (targetDOMNode && targetDOMNode.id !== 'root' && targetDOMNode.firstChild?.nodeType !== 8) {
    // eslint-disable-next-line no-param-reassign
    targetDOMNode.innerHTML = '';
  }

  if (isTemplateResult(element) && targetDOMNode) {
    render(element, targetDOMNode);
  } else {
    showError({
      title: `Expecting an lit template result from the story: "${name}" of "${kind}".`,
      description: dedent`
        Did you forget to return the lit template result from the story?
        Use "() => html\`<your snippet or node>\`" or when defining the story.
      `,
    });
  }
}

import { document } from 'global';
import { RenderContext } from './types';
import PreviewRender from './PreviewRender.svelte';

type Component = any;

let previousComponent: Component = null;
const rootElement = document.getElementById('root');

function cleanUpPreviousStory() {
  if (!previousComponent) {
    return;
  }
  previousComponent.$destroy();
  previousComponent = null;
}

export default function render({
  storyFn,
  kind,
  name,
  showMain,
  showError,
  targetDOMNode = rootElement,
}: RenderContext) {
  cleanUpPreviousStory();

  targetDOMNode.innerHTML = '';

  previousComponent = new PreviewRender({
    targetDOMNode,
    props: {
      storyFn,
      name,
      kind,
      showError,
    },
  });

  showMain();
}

import { document } from 'global';
import { simulatePageLoad, RenderContext } from '@storybook/client-api';

const rootElement = document.getElementById('root');

export default function renderMain({
  storyFn,
  kind,
  name,
  showMain,
  showError,
  forceRender,
}: RenderContext) {
  const element = storyFn();
  console.log('renderMain', element);

  showMain();
  if (typeof element.template === 'string') {
    rootElement.innerHTML = element.template;
    simulatePageLoad(rootElement);
  }
}

import { RenderContext } from '@storybook/store';

import { renderNgApp } from './angular/helpers';
import { AngularFramework, Story } from './types-6-0';

import { RendererFactory } from './angular-beta/RendererFactory';

export const rendererFactory = new RendererFactory();

export const render: Story = (props) => ({ props });
export async function renderToDOM(
  {
    storyFn,
    showMain,
    forceRemount,
    storyContext: { parameters, component },
    id,
  }: RenderContext<AngularFramework>,
  element: HTMLElement
) {
  showMain();

  if (parameters.angularLegacyRendering) {
    renderNgApp(storyFn, !forceRemount);
    return;
  }

  const renderer = await rendererFactory.getRendererInstance(id, element);

  await renderer.render({
    storyFnAngular: storyFn(),
    component,
    parameters,
    forced: !forceRemount,
    targetDOMNode: element,
  });
}

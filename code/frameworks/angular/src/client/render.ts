import type { RenderContext } from '@storybook/store';
import type { ArgsStoryFn } from '@storybook/csf';

import { renderNgApp } from './angular/helpers';
import type { AngularFramework } from './types';

import { RendererFactory } from './angular-beta/RendererFactory';

export const rendererFactory = new RendererFactory();

export const render: ArgsStoryFn<AngularFramework> = (props) => ({ props });

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

  // todo fix eslint. I don't know why it expects void since there is no return type declaration and it should infer it
  // eslint-disable-next-line consistent-return
  return () => renderer.destroy();
}

import { StoryFn } from '@storybook/addons';
import { RendererService } from './angular-beta/RendererService';

import { renderNgApp } from './angular/helpers';
import { StoryFnAngularReturnType } from './types';
import { Parameters } from './types-6-0';

const rootElement = global.document.getElementById('root');

// add proper types
export default function renderMain({
  storyFn,
  forceRender,
  parameters,
  targetDOMNode = rootElement,
}: {
  storyFn: StoryFn<StoryFnAngularReturnType>;
  showMain: () => void;
  forceRender: boolean;
  parameters: Parameters;
  targetDOMNode: HTMLElement;
}) {
  if (parameters.angularLegacyRendering) {
    renderNgApp(storyFn, forceRender);
    return;
  }

  RendererService.getInstance().render({
    storyFnAngular: storyFn(),
    parameters,
    forced: forceRender,
  });
}

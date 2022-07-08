import dedent from 'ts-dedent';
import {component} from 'riot';
import {generateTemplateFunctionFromString} from '@riotjs/compiler'
import type {RenderContext} from '@storybook/store';

import {StoryFnRiotReturnType} from './types';
import {RiotFramework} from './types-6-0';

let currentComponent

export function renderToDOM(
  {title, name, storyFn, showMain, showError, showException}: RenderContext<RiotFramework>,
  domElement: HTMLElement
) {
  const element: StoryFnRiotReturnType = storyFn();

  if (!element) {
    showError({
      title: `Expecting a Riot component from the story: "${name}" of "${title}".`,
      description: dedent`
        Did you forget to return the Riot component from the story?
        Use "() => ({ template: '<my-comp></my-comp>' })" or "() => ({ components: {MyComp}, template: '<my-comp></my-comp>' })" when defining the story.
      `,
    });
    return;
  }

  showMain();

  if (currentComponent) {
    currentComponent.unmount()
  }

  currentComponent = component({
    exports: element,
    template: Function(generateTemplateFunctionFromString(element.template))()
  })(domElement)
}

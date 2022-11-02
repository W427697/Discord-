import global from 'global';
import type { Store_RenderContext, ArgsStoryFn } from '@storybook/types';
import type { SvelteComponentTyped } from 'svelte';
// eslint-disable-next-line import/no-extraneous-dependencies
import PreviewRender from '@storybook/svelte/templates/PreviewRender.svelte';

import type { SvelteFramework } from './types';

const componentsByDomElementKey = new Map<string, SvelteComponentTyped>();

const STORYBOOK_ROOT_ID = 'storybook-root';

function teardown(domElementKey: string) {
  if (!componentsByDomElementKey.has(domElementKey)) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we know it exists because we just checked
  componentsByDomElementKey.get(domElementKey)!.$destroy();

  // in docs mode, the element we render to is a child of the element with the story id
  // TODO: this feels brittle. If we ever change the structure in the <Story /> component, this will break
  const rootElement =
    domElementKey === STORYBOOK_ROOT_ID
      ? global.document.getElementById(domElementKey)
      : global.document.getElementById(domElementKey).children[0];
  rootElement.innerHTML = '';
  componentsByDomElementKey.delete(domElementKey);
}

export function renderToDOM(
  {
    storyFn,
    kind,
    name,
    id,
    showMain,
    showError,
    storyContext,
    forceRemount,
  }: Store_RenderContext<SvelteFramework>,
  domElement: Element
) {
  // in docs mode we're rendering multiple stories to the DOM, so we need to key by the story id
  const domElementKey = storyContext.viewMode === 'docs' ? id : STORYBOOK_ROOT_ID;

  const existingComponent = componentsByDomElementKey.get(domElementKey);

  if (forceRemount) {
    teardown(domElementKey);
  }

  if (!existingComponent || forceRemount) {
    const createdComponent = new PreviewRender({
      target: domElement,
      props: {
        storyFn,
        storyContext,
        name,
        kind,
        showError,
      },
    }) as SvelteComponentTyped;
    componentsByDomElementKey.set(domElementKey, createdComponent);
  } else {
    existingComponent.$set({
      storyFn,
      storyContext,
      name,
      kind,
      showError,
    });
  }

  showMain();

  // teardown the component when the story changes
  return () => {
    teardown(domElementKey);
  };
}

export const render: ArgsStoryFn<SvelteFramework> = (args, context) => {
  const { id, component: Component } = context;
  if (!Component) {
    throw new Error(
      `Unable to render story ${id} as the component annotation is missing from the default export`
    );
  }

  return { Component, props: args };
};

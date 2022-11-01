import type { Store_RenderContext, ArgsStoryFn } from '@storybook/types';
import type { SvelteComponentTyped } from 'svelte';
// eslint-disable-next-line import/no-extraneous-dependencies
import PreviewRender from '@storybook/svelte/templates/PreviewRender.svelte';

import type { SvelteFramework } from './types';

const componentsByDomElementId = new Map<string, SvelteComponentTyped>();

function cleanupExistingComponent(domElementKey: string) {
  if (!componentsByDomElementId.has(domElementKey)) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we know it exists because we just checked
  componentsByDomElementId.get(domElementKey)!.$destroy();
  componentsByDomElementId.delete(domElementKey);
}

export function renderToDOM(
  { storyFn, kind, name, showMain, showError, storyContext }: Store_RenderContext<SvelteFramework>,
  domElement: Element
) {
  // in docs mode we're rendering multiple stories to the DOM, so we need to key by the story id
  const domElementKey = storyContext.viewMode === 'docs' ? storyContext.id : 'storybook-root';
  cleanupExistingComponent(domElementKey);

  const renderedComponent = new PreviewRender({
    target: domElement,
    props: {
      storyFn,
      storyContext,
      name,
      kind,
      showError,
    },
  });
  componentsByDomElementId.set(domElementKey, renderedComponent);

  showMain();
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

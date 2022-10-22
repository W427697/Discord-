/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable camelcase */
// @ts-expect-error (Converted from ts-ignore)
import global from 'global';

import type { Store_RenderContext, ArgsStoryFn } from '@storybook/types';
import PreviewRender from '@storybook/svelte/templates/PreviewRender.svelte';
import { SvelteFramework } from './types';

const { document } = global;

let previousComponent: SvelteFramework['component'] = null;

function cleanUpPreviousStory() {
  if (!previousComponent) {
    return;
  }
  previousComponent.$destroy();
  previousComponent = null;
}

export function renderToDOM(
  { storyFn, kind, name, showMain, showError, storyContext }: Store_RenderContext<SvelteFramework>,
  domElement: Element
) {
  cleanUpPreviousStory();

  const target = domElement || document.getElementById('storybook-root');

  target.innerHTML = '';

  previousComponent = new PreviewRender({
    target,
    props: {
      storyFn,
      storyContext,
      name,
      kind,
      showError,
    },
  });

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

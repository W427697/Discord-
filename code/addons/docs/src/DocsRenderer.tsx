import React from 'react';
import ReactDOM from 'react-dom';
import type { Renderer, Parameters, DocsContextProps, DocsRenderFunction } from '@storybook/types';
import { Docs, CodeOrSourceMdx, AnchorMdx, HeadersMdx } from '@storybook/blocks';
import type { Root as ReactRoot } from 'react-dom/client';

// TS doesn't like that we export a component with types that it doesn't know about (TS4203)
export const defaultComponents: Record<string, any> = {
  code: CodeOrSourceMdx,
  a: AnchorMdx,
  ...HeadersMdx,
};

// A map of all rendered React 18 nodes
const nodes = new Map<Element, ReactRoot>();

// Determine if we can use the new React 18 Root API.
// Based on the similar logic in `code/renderers/react/src/render.tsx`
const getReactRoot = async (el: Element): Promise<ReactRoot | null> => {
  let root = nodes.get(el);

  if (!root) {
    try {
      // See if we can import the new `react-dom/client`, so we can use the new Root API
      // If this fails, fallback to the old `react-dom` API
      const reactDomClient = (await import('react-dom/client')).default;
      root = reactDomClient.createRoot(el);
      nodes.set(el, root);
    } catch (error) {
      // We can't use the new React 18 Root API
      return null;
    }
  }

  return root;
};

export class DocsRenderer<TRenderer extends Renderer> {
  public render: DocsRenderFunction<TRenderer>;

  public unmount: (element: HTMLElement) => void;

  constructor() {
    this.render = (
      context: DocsContextProps<TRenderer>,
      docsParameter: Parameters,
      element: HTMLElement,
      callback: () => void
    ): void => {
      // Use a random key to force the container to re-render each time we call `renderDocs`
      //   TODO: do we still need this? It was needed for angular (legacy) inline rendering:
      //   https://github.com/storybookjs/storybook/pull/16149
      const components = {
        ...defaultComponents,
        ...docsParameter?.components,
      };

      import('@mdx-js/react').then(async ({ MDXProvider }) => {
        const root = await getReactRoot(element);

        const content = (
          <MDXProvider components={components}>
            <Docs key={Math.random()} context={context} docsParameter={docsParameter} />
          </MDXProvider>
        );

        if (root) {
          root.render(content);
          callback();
        } else {
          ReactDOM.render(content, element, callback);
        }
      });
    };

    this.unmount = (element: HTMLElement) => {
      const root = nodes.get(element);

      if (root) {
        root.unmount();
        nodes.delete(element);
      } else {
        ReactDOM.unmountComponentAtNode(element);
      }
    };
  }
}

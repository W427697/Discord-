import React, { ComponentType, ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { AnyFramework } from '@storybook/csf';
import { ModuleExports, Story } from '@storybook/store';

import { DocsContextProps } from './types';
import { NoDocs } from './NoDocs';

export function renderLegacyDocs<TFramework extends AnyFramework>(
  story: Story<TFramework>,
  docsContext: DocsContextProps<TFramework>,
  element: HTMLElement,
  callback: () => void
) {
  return renderLegacyDocsAsync(story, docsContext, element).then(callback);
}

export function renderDocs<TFramework extends AnyFramework>(
  exports: ModuleExports,
  docsContext: DocsContextProps<TFramework>,
  element: HTMLElement,
  callback: () => void
) {
  return renderDocsAsync(exports, docsContext, element).then(callback);
}

async function renderLegacyDocsAsync<TFramework extends AnyFramework>(
  story: Story<TFramework>,
  docsContext: DocsContextProps<TFramework>,
  element: HTMLElement
) {
  const { docs } = story.parameters;
  if ((docs?.getPage || docs?.page) && !(docs?.getContainer || docs?.container)) {
    throw new Error('No `docs.container` set, did you run `addon-docs/preset`?');
  }

  const DocsContainer: ComponentType<{ context: DocsContextProps<TFramework> }> =
    docs.container ||
    (await docs.getContainer?.()) ||
    (({ children }: { children: Element }) => <>{children}</>);

  const Page: ComponentType = docs.page || (await docs.getPage?.()) || NoDocs;

  // Use `componentId` as a key so that we force a re-render every time
  // we switch components
  const docsElement = (
    <DocsContainer key={story.componentId} context={docsContext}>
      <Page />
    </DocsContainer>
  );

  await new Promise<void>((resolve) => {
    ReactDOM.render(docsElement, element, resolve);
  });
}

async function renderDocsAsync<TFramework extends AnyFramework>(
  exports: ModuleExports,
  docsContext: DocsContextProps<TFramework>,
  element: HTMLElement
) {
  // FIXME -- is this at all correct?
  const DocsContainer = ({ children }: { children: ReactElement }) => <>{children}</>;

  const Page = exports.default;

  // FIXME -- do we need to set a key as above?
  const docsElement = (
    <DocsContainer>
      <Page />
    </DocsContainer>
  );

  await new Promise<void>((resolve) => {
    ReactDOM.render(docsElement, element, resolve);
  });
}

export function unmountDocs(element: HTMLElement) {
  ReactDOM.unmountComponentAtNode(element);
}

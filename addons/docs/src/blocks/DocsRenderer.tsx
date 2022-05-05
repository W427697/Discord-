import React, { ComponentType, ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { AnyFramework, Parameters } from '@storybook/csf';
import { DocsContainer } from './DocsContainer';
import { DocsPage } from './DocsPage';

import { DocsContext, DocsContextProps } from './DocsContext';

export function renderDocs<TFramework extends AnyFramework>(
  docsContext: DocsContextProps<TFramework>,
  docsParameters: Parameters,
  element: HTMLElement,
  callback: () => void
): void {
  renderDocsAsync(docsContext, docsParameters, element).then(callback);
}

async function renderDocsAsync<TFramework extends AnyFramework>(
  docsContext: DocsContextProps<TFramework>,
  docsParameters: Parameters,
  element: HTMLElement
) {
  // FIXME -- use DocsContainer, make it work for modern
  const SimpleContainer = ({ children }: any) => (
    <DocsContext.Provider value={docsContext}>{children} </DocsContext.Provider>
  );

  const Container: ComponentType<{ context: DocsContextProps<TFramework> }> =
    docsParameters.container ||
    (await docsParameters.getContainer?.()) ||
    (docsContext.legacy ? DocsContainer : SimpleContainer);

  const Page: ComponentType = docsParameters.page || (await docsParameters.getPage?.()) || DocsPage;

  // Use `title` as a key so that we force a re-render every time we switch components
  const docsElement = (
    <Container key={docsContext.title} context={docsContext}>
      <Page />
    </Container>
  );

  await new Promise<void>((resolve) => {
    ReactDOM.render(docsElement, element, resolve);
  });
}

export function unmountDocs(element: HTMLElement) {
  ReactDOM.unmountComponentAtNode(element);
}

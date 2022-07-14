import React, { FunctionComponent, ComponentType } from 'react';
import { AnyFramework, Parameters } from '@storybook/csf';
import { DocsContextProps } from './DocsContext';
import { DocsContainer } from './DocsContainer';
import { DocsPage } from './DocsPage';

export type DocsProps<TFramework extends AnyFramework = AnyFramework> = {
  parameters: Parameters;
  context: DocsContextProps<TFramework>;
};

export const Docs: FunctionComponent<DocsProps> = ({ parameters, context }) => {
  const Container: ComponentType<{ context: DocsContextProps }> =
    parameters.container || DocsContainer;

  const Page = parameters.page || DocsPage;

  return (
    <Container context={context} theme={parameters.theme}>
      <Page />
    </Container>
  );
};

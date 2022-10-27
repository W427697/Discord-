import type { AnyFramework, Parameters } from '@storybook/types';
import { DocsContextProps } from './DocsContextProps';

export type DocsRenderFunction<TFramework extends AnyFramework> = (
  docsContext: DocsContextProps<TFramework>,
  docsParameters: Parameters,
  element: HTMLElement,
  callback: () => void
) => void;

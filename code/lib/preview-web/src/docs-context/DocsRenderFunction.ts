import type { Renderer, Parameters } from '@storybook/types';
import type { DocsContextProps } from './DocsContextProps';

export type DocsRenderFunction<TRenderer extends Renderer> = (
  docsContext: DocsContextProps<TRenderer>,
  docsParameters: Parameters,
  element: HTMLElement,
  callback: () => void
) => void;

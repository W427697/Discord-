/* eslint-disable camelcase */
import { Store_RenderContext } from '@storybook/types';
import type { ClientAPI_RenderContextWithoutStoryContext } from '@storybook/types';

export interface PreviewError {
  message?: string;
  stack?: string;
}

// Copy of require.context
// interface RequireContext {
//   keys(): string[];
//   (id: string): any;
//   <T>(id: string): T;
//   resolve(id: string): string;
//   /** The module id of the context module. This may be useful for module.hot.accept. */
//   id: string;
// }

export interface RequireContext {
  keys: () => string[];
  (id: string): any;
  resolve(id: string): string;
}
export type LoaderFunction = () => void | any[];
export type Loadable = RequireContext | RequireContext[] | LoaderFunction;

export type { Store_RenderContext as RenderContext, ClientAPI_RenderContextWithoutStoryContext };

// The function used by a framework to render story to the DOM
export type RenderStoryFunction = (context: Store_RenderContext) => void;

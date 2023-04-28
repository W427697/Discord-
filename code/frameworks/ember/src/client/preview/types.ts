import type { WebRenderer } from '@junk-temporary-prototypes/types';

export type { RenderContext } from '@junk-temporary-prototypes/types';

export interface ShowErrorArgs {
  title: string;
  description: string;
}

export interface OptionsArgs {
  template: any;
  context: any;
  element: any;
}

/**
 * @deprecated Use `EmberRenderer` instead.
 */
export type EmberFramework = EmberRenderer;
export interface EmberRenderer extends WebRenderer {
  component: any;
  storyResult: OptionsArgs;
}

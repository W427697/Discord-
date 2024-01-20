import type { WebRenderer } from '@storybook/core/dist/modules/types/index';

export type { RenderContext } from '@storybook/core/dist/modules/types/index';

export interface ShowErrorArgs {
  title: string;
  description: string;
}

export interface OptionsArgs {
  template: any;
  context: any;
  element: any;
}

export interface EmberRenderer extends WebRenderer {
  component: any;
  storyResult: OptionsArgs;
}

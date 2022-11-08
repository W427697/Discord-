import type { Framework } from '@storybook/types';

export type { RenderContext } from '@storybook/types';

export interface ShowErrorArgs {
  title: string;
  description: string;
}

export interface OptionsArgs {
  template: any;
  context: any;
  element: any;
}

export interface EmberFramework extends Framework {
  component: any;
  storyResult: OptionsArgs;
}

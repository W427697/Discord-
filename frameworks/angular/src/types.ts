import type { StorybookConfig as BaseConfig } from '@storybook/core-common';

export interface AngularOptions {
  enableIvy: boolean;
}

/**
 * The interface for Storybook configuration in `main.ts` files.
 */
export interface StorybookConfig extends BaseConfig {
  framework:
    | string
    | {
        name: '@storybook/angular';
        options: AngularOptions;
      };
}

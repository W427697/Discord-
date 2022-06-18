import type ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import type { Configuration } from 'webpack';

import type { StorybookConfig as BaseStorybookConfig } from '@storybook/preset-react-webpack';

export type { BuilderResult } from '@storybook/preset-react-webpack';

/**
 * Options for TypeScript usage within Storybook.
 */
export type TypescriptOptions = BaseStorybookConfig['typescript'] & {
  /**
   * Configures `fork-ts-checker-webpack-plugin`
   */
  checkOptions: ForkTsCheckerWebpackPlugin['options'];
};

export interface StorybookTypescriptConfig {
  typescript?: Partial<TypescriptOptions>;
}

export interface ReactOptions {
  fastRefresh?: boolean;
  strictMode?: boolean;
  /**
   * Use React's legacy root API to mount components
   * @description
   * React has introduced a new root API with React 18.x to enable a whole set of new features (e.g. concurrent features)
   * If this flag is true, the legacy Root API is used to mount components to make it easier to migrate step by step to React 18.
   * @default false
   */
  legacyRootApi?: boolean;
}

export interface StorybookReactConfig {
  framework:
    | string
    | {
        name: '@storybook/react-webpack5';
        options: ReactOptions;
      };
}

/**
 * The interface for Storybook configuration in `main.ts` files.
 */
export type StorybookConfig = BaseStorybookConfig<Configuration> &
  StorybookReactConfig &
  StorybookTypescriptConfig;

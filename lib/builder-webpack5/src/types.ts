import type ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import type { PluginOptions } from '@storybook/react-docgen-typescript-plugin';
import type { Configuration, Stats } from 'webpack';
import type {
  Options,
  TypescriptOptions as BaseTypescriptOptions,
  BuilderResult as BaseBuilderResult,
} from '@storybook/core-common';

/**
 * Options for TypeScript usage within Storybook.
 */
export interface TypescriptOptions extends BaseTypescriptOptions {
  /**
   * Configures `fork-ts-checker-webpack-plugin`
   */
  checkOptions?: ForkTsCheckerWebpackPlugin['options'];
  /**
   * Sets the type of Docgen when working with React and TypeScript
   *
   * @default `'react-docgen-typescript'`
   */
  reactDocgen: 'react-docgen-typescript' | 'react-docgen' | false;
  /**
   * Configures `react-docgen-typescript-plugin`
   *
   * @default
   * @see https://github.com/storybookjs/storybook/blob/next/lib/builder-webpack5/src/config/defaults.js#L4-L6
   */
  reactDocgenTypescriptOptions: PluginOptions;
}

export interface StorybookWebpackConfig {
  /**
   * Modify or return a custom Webpack config after the Storybook's default configuration
   * has run (mostly used by addons).
   */
  webpack?: (config: Configuration, options: Options) => Configuration | Promise<Configuration>;

  /**
   * Modify or return a custom Webpack config after every addon has run.
   */
  webpackFinal?: (
    config: Configuration,
    options: Options
  ) => Configuration | Promise<Configuration>;
}

export interface BuilderResult extends BaseBuilderResult {
  stats?: Stats;
}

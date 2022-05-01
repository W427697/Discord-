import type {
  Options,
  TypescriptOptions as BaseTypescriptOptions,
  BuilderResult as BaseBuilderResult,
  StorybookConfig as BaseStorybookConfig,
} from '@storybook/core-common';

export type { Options, Preset } from '@storybook/core-common';

export interface ForkTsCheckerWebpackPluginOptions {}

export interface ReactDocgenTypescriptOptions {}

export interface WebpackConfiguration {
  plugins?: any[];
  module?: {
    rules?: any[];
  };
  resolve?: {
    extensions?: string[];
    mainFields?: string[];
    alias?: any;
  };
  optimization?: any;
  devtool?: string;
}

export interface WebpackStats {}

/**
 * Options for TypeScript usage within Storybook.
 */
export interface TypescriptOptions<
  TForkTsCheckerWebpackPluginOptions extends ForkTsCheckerWebpackPluginOptions = ForkTsCheckerWebpackPluginOptions,
  TReactDocgenTypescriptOptions extends ReactDocgenTypescriptOptions = ReactDocgenTypescriptOptions
> extends BaseTypescriptOptions {
  /**
   * Configures `fork-ts-checker-webpack-plugin`
   */
  checkOptions?: TForkTsCheckerWebpackPluginOptions;
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
  reactDocgenTypescriptOptions: TReactDocgenTypescriptOptions;
}

export interface StorybookWebpackConfig<
  TConfiguration extends WebpackConfiguration = WebpackConfiguration
> {
  /**
   * Modify or return a custom Webpack config after the Storybook's default configuration
   * has run (mostly used by addons).
   */
  webpack?: (config: TConfiguration, options: Options) => TConfiguration | Promise<TConfiguration>;

  /**
   * Modify or return a custom Webpack config after every addon has run.
   */
  webpackFinal?: (
    config: TConfiguration,
    options: Options
  ) => TConfiguration | Promise<TConfiguration>;
}

export type StorybookConfig<TConfiguration extends WebpackConfiguration = WebpackConfiguration> =
  StorybookWebpackConfig<TConfiguration> & BaseStorybookConfig;

export interface BuilderResult<TStats extends WebpackStats> extends BaseBuilderResult {
  stats?: TStats;
}

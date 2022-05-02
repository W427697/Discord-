import type { Options, StorybookConfig as BaseStorybookConfig } from '@storybook/core-common';

export type { Options, Preset, BuilderResult, TypescriptOptions } from '@storybook/core-common';

export interface CommonWebpackConfiguration {
  plugins?: any[];
  module?: {
    rules?: any[];
  };
  resolve?: {
    extensions?: string[];
    mainFields?: string[] | string[][];
    alias?: any;
  };
  optimization?: any;
  devtool?: boolean | string;
}

export interface StorybookWebpackConfig<TConfiguration extends CommonWebpackConfiguration> {
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

export type StorybookConfig<
  TWebpackConfiguration extends CommonWebpackConfiguration = CommonWebpackConfiguration
> = BaseStorybookConfig & StorybookWebpackConfig<TWebpackConfiguration>;

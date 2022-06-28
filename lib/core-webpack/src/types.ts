import type { Options, StorybookConfig as BaseStorybookConfig } from '@storybook/core-common';

export type { Options, Preset, BuilderResult, TypescriptOptions } from '@storybook/core-common';

export type RulesConfig = any;

export type ModuleConfig = {
  rules?: RulesConfig[];
};

export type ResolveConfig = {
  extensions?: string[];
  mainFields?: string[] | string[][];
  alias?: any;
};

export interface CommonWebpackConfiguration {
  plugins?: any[];
  module?: ModuleConfig;
  resolve?: ResolveConfig;
  optimization?: any;
  devtool?: boolean | string;
}

export interface StorybookWebpackConfig<TConfiguration = CommonWebpackConfiguration> {
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

export type StorybookConfig<TWebpackConfiguration = CommonWebpackConfiguration> =
  BaseStorybookConfig & StorybookWebpackConfig<TWebpackConfiguration>;

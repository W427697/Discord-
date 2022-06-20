import type {
  WebpackConfiguration,
  StorybookConfig as StorybookConfigBase,
  TypescriptOptions as BaseTypescriptOptions,
} from '@storybook/core-webpack';

export type { BuilderResult } from '@storybook/core-webpack';

export type TypescriptOptions = BaseTypescriptOptions;

export type StorybookConfig<TWebpackConfiguration = WebpackConfiguration> =
  StorybookConfigBase<TWebpackConfiguration>;

export type SvelteOptions = {};

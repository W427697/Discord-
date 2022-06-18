import type {
  CommonWebpackConfiguration,
  StorybookConfig as BaseStorybookConfig,
  TypescriptOptions as BaseTypescriptOptions,
} from '@storybook/core-webpack';

export type { BuilderResult } from '@storybook/core-webpack';

export type TypescriptOptions = BaseTypescriptOptions;

export type StorybookConfig<TWebpackConfiguration = CommonWebpackConfiguration> =
  BaseStorybookConfig<TWebpackConfiguration>;

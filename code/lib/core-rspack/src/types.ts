import type { RspackOptions } from '@rspack/core';
import type { Options, StorybookConfig as StorybookConfigBase } from '@storybook/types';

export type { Options, Preset, BuilderResult, TypescriptOptions } from '@storybook/types';

export type RulesConfig = any;

export type ModuleConfig = {
  rules?: RulesConfig[];
};

export type RspackConfiguration = RspackOptions;

export type ResolveConfig = {
  extensions?: string[];
  mainFields?: string[] | undefined;
  alias?: any;
};

export type StorybookConfig<TRspackConfiguration = RspackOptions> = StorybookConfigBase & {
  /**
   * Modify or return a custom Rspack config after the Storybook's default configuration
   * has run (mostly used by addons).
   */
  rspack?: (
    config: TRspackConfiguration,
    options: Options
  ) => TRspackConfiguration | Promise<TRspackConfiguration>;

  /**
   * Modify or return a custom Rspack config after every addon has run.
   */
  rspackFinal?: (
    config: TRspackConfiguration,
    options: Options
  ) => TRspackConfiguration | Promise<TRspackConfiguration>;
};

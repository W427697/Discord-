import type { Builder, StorybookConfig as StorybookBaseConfig, Options } from '@storybook/types';
import type { InlineConfig, UserConfig } from 'vite';

// Storybook's Stats are optional Webpack related property
type ViteStats = {
  toJson: () => any;
};

export type ViteBuilder = Builder<UserConfig, ViteStats>;

export type ViteFinal = (
  config: InlineConfig,
  options: Options
) => InlineConfig | Promise<InlineConfig>;

export type StorybookViteConfig = StorybookBaseConfig & {
  viteFinal?: ViteFinal;
};

// Using instead of `Record<string, string>` to provide better aware of used options
type IframeOptions = {
  title: string;
};

export type ExtendedOptions = Options & IframeOptions;

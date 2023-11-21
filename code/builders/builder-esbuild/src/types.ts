import type { Builder, StorybookConfig as StorybookBaseConfig } from '@storybook/types';
import type { BuildOptions } from 'esbuild';

export type EsbuildBuilder = Builder<BuildOptions, {}>;
export type StorybookConfig = StorybookBaseConfig;
// FIXME: Need TS4 to include vite types
// import type { InlineConfig } from 'vite';
import type {
  Options,
  StorybookConfig as BaseStorybookConfig,
  TypescriptOptions as BaseTypescriptOptions,
} from '@storybook/core-common';

export type { Options, Preset, BuilderResult } from '@storybook/core-common';

export type ViteFinal = (config: any, options: Options) => any | Promise<any>;

/**
 * Options for TypeScript usage within Storybook.
 */
export interface TypescriptOptions extends BaseTypescriptOptions {
  /**
   * Sets the type of Docgen when working with React and TypeScript
   *
   * @default `'react-docgen-typescript'`
   */
  reactDocgen: 'react-docgen-typescript' | 'react-docgen' | false;
}

export type StorybookConfig = BaseStorybookConfig & {
  viteFinal: ViteFinal;
};

import type {
  CommonWebpackConfiguration,
  StorybookConfig as BaseStorybookConfig,
  TypescriptOptions as BaseTypescriptOptions,
} from '@storybook/webpack-tools';
import type { PluginOptions as ReactDocgenTypescriptOptions } from '@storybook/react-docgen-typescript-plugin';

export type { BuilderResult } from '@storybook/webpack-tools';

export interface ReactOptions {
  fastRefresh?: boolean;
  strictMode?: boolean;
  /**
   * Use React's legacy root API to mount components
   * @description
   * React has introduced a new root API with React 18.x to enable a whole set of new features (e.g. concurrent features)
   * If this flag is true, the legacy Root API is used to mount components to make it easier to migrate step by step to React 18.
   * @default false
   */
  legacyRootApi?: boolean;
}

/**
 * The interface for Storybook configuration in `main.ts` files.
 */
export interface ReactConfig {
  framework:
    | string
    | {
        name: '@storybook/react';
        options: ReactOptions;
      };
}

export type TypescriptOptions = BaseTypescriptOptions & {
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
  reactDocgenTypescriptOptions: ReactDocgenTypescriptOptions;
};

export type StorybookConfig<TWebpackConfiguration = CommonWebpackConfiguration> =
  BaseStorybookConfig<TWebpackConfiguration> &
    ReactConfig & {
      typescript?: Partial<TypescriptOptions>;
    };

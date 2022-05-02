import type {
  CommonWebpackConfiguration,
  StorybookConfig as BaseStorybookConfig,
  TypescriptOptions as BaseTypescriptOptions,
} from '@storybook/webpack-tools';

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
  reactDocgen: 'react-docgen-typescript' | 'react-docgen' | false;
  reactDocgenTypescriptOptions: any;
};

export type StorybookConfig<TWebpackConfiguration = CommonWebpackConfiguration> =
  BaseStorybookConfig<TWebpackConfiguration> &
    ReactConfig & {
      typescript?: TypescriptOptions;
    };

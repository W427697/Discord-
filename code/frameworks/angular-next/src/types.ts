import type {StorybookConfig as StorybookConfigBase} from '@storybook/builder-esbuild'

type FrameworkName = '@storybook/angular-next';
type BuilderName = '@storybook/builder-esbuild';

// TODO
type BuilderOptions = {

}

export type FrameworkOptions = {
  builder?: BuilderOptions;
};

type StorybookConfigFramework = {
  framework:
    | FrameworkName
    | {
        name: FrameworkName;
        options: FrameworkOptions;
      };
  core?: StorybookConfigBase['core'] & {
    builder?:
      | BuilderName
      | {
          name: '@storybook/builder-webpack5';
          options: BuilderOptions;
        } | {
          name: BuilderName;
          options: BuilderOptions;
        };
  };
};

/**
 * The interface for Storybook configuration in `main.ts` files.
 */
export type StorybookConfig = StorybookConfigBase & StorybookConfigFramework;

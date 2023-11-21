import { StorybookConfig as StorybookConfigBase } from '@storybook/builder-esbuild';

type FrameworkName = '@storybook/angular-next';

// TODO
type BuilderOptions = {};

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
      | string
      | {
          name: string;
          options: BuilderOptions;
        };
  };
};

/**
 * The interface for Storybook configuration in `main.ts` files.
 */
export type StorybookConfig = StorybookConfigBase & StorybookConfigFramework;

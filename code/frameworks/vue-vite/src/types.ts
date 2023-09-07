import type { StorybookConfig as StorybookConfigBase } from '@storybook/types';
import type { StorybookConfigVite, BuilderOptions } from '@storybook/builder-vite';
import type { DocGenOptions } from 'vue-docgen-api';

type FrameworkName = '@storybook/vue-vite';
type BuilderName = '@storybook/builder-vite';

export type FrameworkOptions = {
  builder?: BuilderOptions;
  docgenOptions?: DocGenOptions;
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
          name: BuilderName;
          options: BuilderOptions;
        };
  };
};

/**
 * The interface for Storybook configuration in `main.ts` files.
 */
export type StorybookConfig = Omit<
  StorybookConfigBase,
  keyof StorybookConfigVite | keyof StorybookConfigFramework
> &
  StorybookConfigVite &
  StorybookConfigFramework;

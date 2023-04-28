import type { StorybookConfig as StorybookConfigBase } from '@junk-temporary-prototypes/types';
import type { StorybookConfigVite, BuilderOptions } from '@junk-temporary-prototypes/builder-vite';

type FrameworkName = '@junk-temporary-prototypes/sveltekit';
type BuilderName = '@junk-temporary-prototypes/builder-vite';

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

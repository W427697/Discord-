import type { StorybookConfig as StorybookConfigBase } from '@storybook/preset-server-webpack';
import type {
  StorybookConfigVite,
  BuilderOptions,
  // TypescriptOptions as TypescriptOptionsBuilder,
} from '@storybook/builder-vite';

type FrameworkName = '@storybook/nextjs-server';
type BuilderName = '@storybook/builder-vite';

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
  // typescript?: Partial<TypescriptOptionsBuilder & TypescriptOptionsReact> &
  //   StorybookConfigBase['typescript'];
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

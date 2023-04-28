import type {
  StorybookConfig as StorybookConfigBase,
  TypescriptOptions as TypescriptOptionsWebComponents,
} from '@junk-temporary-prototypes/preset-web-components-webpack';
import type {
  BuilderOptions,
  StorybookConfigWebpack,
  TypescriptOptions as TypescriptOptionsBuilder,
} from '@junk-temporary-prototypes/builder-webpack5';

type FrameworkName = '@junk-temporary-prototypes/web-components-webpack5';
type BuilderName = '@junk-temporary-prototypes/builder-webpack5';

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
  typescript?: Partial<TypescriptOptionsBuilder & TypescriptOptionsWebComponents> &
    StorybookConfigBase['typescript'];
};

/**
 * The interface for Storybook configuration in `main.ts` files.
 */
export type StorybookConfig = Omit<
  StorybookConfigBase,
  keyof StorybookConfigWebpack | keyof StorybookConfigFramework
> &
  StorybookConfigWebpack &
  StorybookConfigFramework;

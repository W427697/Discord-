import type { BuilderContext } from '@angular-devkit/architect';
import type { LoadOptions, CLIOptions, BuilderOptions } from '@storybook/types';

export type StandaloneOptions = Partial<
  CLIOptions &
    LoadOptions &
    BuilderOptions & {
      mode?: 'static' | 'dev';
      angularBrowserTarget?: string | null;
      angularBuilderOptions?: Record<string, any> & {
        styles?: any[];
        stylePreprocessorOptions?: any;
      };
      angularBuilderContext?: BuilderContext | null;
      tsConfig?: string;
    }
>;

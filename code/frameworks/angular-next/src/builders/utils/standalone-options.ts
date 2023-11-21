import { BuilderContext } from '@angular-devkit/architect';
import { ApplicationBuilderOptions } from '@angular-devkit/build-angular';
import { LoadOptions, CLIOptions, BuilderOptions } from '@storybook/types';

export type StandaloneOptions = CLIOptions &
  LoadOptions &
  BuilderOptions & {
    mode?: 'static' | 'dev';
    angularBrowserTarget?: string | null;
    angularBuilderOptions?: ApplicationBuilderOptions;
    angularBuilderContext?: BuilderContext;
  };

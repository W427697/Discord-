import { BuilderContext } from '@angular-devkit/architect';
import {
  AssetPattern,
  StyleElement,
  StylePreprocessorOptions,
} from '@angular-devkit/build-angular/src/builders/browser/schema';
import { LoadOptions, CLIOptions, BuilderOptions } from '@junk-temporary-prototypes/types';

export type StandaloneOptions = CLIOptions &
  LoadOptions &
  BuilderOptions & {
    mode?: 'static' | 'dev';
    angularBrowserTarget?: string | null;
    angularBuilderOptions?: Record<string, any> & {
      styles?: StyleElement[];
      stylePreprocessorOptions?: StylePreprocessorOptions;
      assets?: AssetPattern[];
    };
    angularBuilderContext?: BuilderContext | null;
    tsConfig?: string;
  };

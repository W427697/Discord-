import type { Options } from '@storybook/core-common';

// Using instead of `Record<string, string>` to provide better aware of used options
type IframeOptions = {
  frameworkPath: string;
  title: string;
  // FIXME: Use @ndelangen's improved types
  framework: string;
};

export type ExtendedOptions = Options & IframeOptions;

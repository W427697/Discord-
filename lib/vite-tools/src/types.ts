// FIXME: Need TS4 to include vite types
// import type { InlineConfig } from 'vite';
// import type { Options, StorybookConfig as BaseStorybookConfig } from '@storybook/core-common';

export type {
  Options,
  Preset,
  BuilderResult,
  TypescriptOptions,
  StorybookConfig,
} from '@storybook/core-common';

// export type ViteFinal = (
//   config: InlineConfig,
//   options: Options
// ) => InlineConfig | Promise<InlineConfig>;

// export type StorybookConfig = BaseStorybookConfig & {
//   viteFinal: ViteFinal;
// };

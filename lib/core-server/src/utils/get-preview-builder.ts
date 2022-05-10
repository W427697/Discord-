import type { Options, CoreConfig } from '@storybook/core-common';

export async function getPreviewBuilder(options: Options) {
  const { configDir, presets } = options;
  const core = await presets.apply<CoreConfig>('core', undefined);

  let builderPackage: string;
  if (core?.builder) {
    const builderName = typeof core.builder === 'string' ? core.builder : core.builder?.name;
    builderPackage = require.resolve(
      ['webpack4', 'webpack5'].includes(builderName)
        ? `@storybook/builder-${builderName}`
        : builderName,
      { paths: [configDir] }
    );
  } else {
    builderPackage = require.resolve('@storybook/builder-webpack4');
  }
  const previewBuilder = await import(builderPackage);
  return previewBuilder;
}

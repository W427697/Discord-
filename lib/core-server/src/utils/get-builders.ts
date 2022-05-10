import type { Options, CoreConfig, Builder } from '@storybook/core-common';

export async function getManagerBuilder(options: Options) {
  const { configDir, presets } = options;
  const core = await presets.apply<CoreConfig>('core', undefined);

  const builderName = typeof core?.builder === 'string' ? core.builder : core?.builder?.name;

  // Builder can be any string including community builders like `storybook-builder-vite`.
  // - For now, `webpack5` triggers `manager-webpack5`
  // - Everything else builds with `manager-webpack4`
  //
  // Unlike preview builders, manager building is not pluggable!
  const builderPackage = ['webpack5', '@storybook/builder-webpack5'].includes(builderName)
    ? require.resolve('@storybook/manager-webpack5', { paths: [configDir] })
    : '@storybook/manager-webpack4';

  const managerBuilder = await import(builderPackage);
  return managerBuilder;
}

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

export async function getBuilders(options: Options): Promise<Builder<unknown, unknown>[]> {
  return Promise.all([getPreviewBuilder(options), getManagerBuilder(options)]);
}

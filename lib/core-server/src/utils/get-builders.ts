import type { Options, CoreConfig, Builder } from '@storybook/core-common';

async function getManagerBuilder(builderName: string | undefined, configDir: string) {
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

async function getPreviewBuilder(builderName: string, configDir: string) {
  let builderPackage: string;
  if (builderName) {
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

export async function getBuilders({
  presets,
  configDir,
}: Options): Promise<Builder<unknown, unknown>[]> {
  const core = await presets.apply<CoreConfig>('core', undefined);
  const builderName = typeof core?.builder === 'string' ? core.builder : core?.builder?.name;

  return Promise.all([
    getPreviewBuilder(builderName, configDir),
    getManagerBuilder(builderName, configDir),
  ]);
}

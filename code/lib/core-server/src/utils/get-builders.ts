import type { Builder, CoreConfig, Options } from '@junk-temporary-prototypes/types';
import { pathToFileURL } from 'node:url';

export async function getManagerBuilder(): Promise<Builder<unknown>> {
  return import('@junk-temporary-prototypes/builder-manager');
}

export async function getPreviewBuilder(
  builderName: string,
  configDir: string
): Promise<Builder<unknown>> {
  let builderPackage: string;
  if (builderName) {
    builderPackage = require.resolve(
      ['webpack5'].includes(builderName) ? `@junk-temporary-prototypes/builder-${builderName}` : builderName,
      { paths: [configDir] }
    );
  } else {
    throw new Error('no builder configured!');
  }
  const previewBuilder = await import(pathToFileURL(builderPackage).href);
  return previewBuilder;
}

export async function getBuilders({ presets, configDir }: Options): Promise<Builder<unknown>[]> {
  const { builder } = await presets.apply<CoreConfig>('core', {});
  const builderName = typeof builder === 'string' ? builder : builder?.name;

  return Promise.all([getPreviewBuilder(builderName, configDir), getManagerBuilder()]);
}

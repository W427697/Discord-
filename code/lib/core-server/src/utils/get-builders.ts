import type { Builder, Options } from '@storybook/types';
import { MissingBuilderError } from '@storybook/core-events/server-errors';
import { pathToFileURL } from 'node:url';
import { resolve as resolveESM } from 'import-meta-resolve';

import readPkg from 'read-pkg-up';

import * as rr from 'resolve.exports';
import { join } from 'node:path';

export async function getManagerBuilder(): Promise<Builder<unknown>> {
  return import('@storybook/builder-manager');
}

export async function getPreviewBuilder(
  builderName: string,
  configDir: string
): Promise<Builder<unknown>> {
  const full = ['webpack5'].includes(builderName)
    ? `@storybook/builder-${builderName}`
    : builderName;

  const errors = [];

  try {
    const pkg = await readPkg({ cwd: require.resolve(full, { paths: [configDir] }) });

    if (pkg?.packageJson?.exports) {
      const specifier = rr.exports(pkg.packageJson, '.');
      console.log({ specifier });
      if (!specifier) {
        throw new Error('no default specifier');
      }
      const resolved = join(pathToFileURL(full).href, specifier[0]);
      console.log({ resolved });
      return await import(resolved);
    }
  } catch (e) {
    errors.push(e);
  }

  try {
    const resolved = await resolveESM(pathToFileURL(full).href, pathToFileURL(configDir).href);
    console.log({ resolved2: resolved });
    return await import(resolved);
  } catch (e) {
    errors.push(e);
  }

  try {
    return await import(pathToFileURL(full).href);
  } catch (e) {
    errors.push(e);
  }

  console.log('NOOOOO');
  if (errors.length > 0) {
    console.log('tried loading builder ' + full + ' but failed with errors:');
    throw new Error(JSON.stringify(errors, null, 2));
  }
}

export async function getBuilders({ presets, configDir }: Options): Promise<Builder<unknown>[]> {
  const { builder } = await presets.apply('core', {});

  if (!builder) {
    throw new MissingBuilderError();
  }

  const builderName = typeof builder === 'string' ? builder : builder.name;

  return Promise.all([getPreviewBuilder(builderName, configDir), getManagerBuilder()]);
}

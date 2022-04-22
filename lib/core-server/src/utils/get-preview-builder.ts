import path from 'path';
import { getInterpretedFile, serverRequire } from '@storybook/core-common';
import type { Options } from '@storybook/core-common';

export async function getPreviewBuilder(configDir: Options['configDir']) {
  const main = path.resolve(configDir, 'main');
  const mainFile = getInterpretedFile(main);
  const { core } = mainFile ? serverRequire(mainFile) : { core: null };

  if (!core?.builder) {
    throw new Error('builder required');
  }

  const builderPath = typeof core.builder === 'string' ? core.builder : core.builder?.name;

  return import(builderPath);
}

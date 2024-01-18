import { sync as readUpSync } from 'read-pkg-up';
import { buildStaticStandalone, withTelemetry } from '@storybook/core-server';
import { cache } from '@storybook/core-common';
import invariant from 'tiny-invariant';

import { dirname } from 'node:path';
import { fileURLToPath } from 'url';

// eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
const __dirname = dirname(fileURLToPath(import.meta.url));

export const build = async (cliOptions: any) => {
  const readUpResult = readUpSync({ cwd: __dirname });
  invariant(readUpResult, 'Failed to find the closest package.json file.');
  const options = {
    ...cliOptions,
    configDir: cliOptions.configDir || './.storybook',
    outputDir: cliOptions.outputDir || './storybook-static',
    ignorePreview: !!cliOptions.previewUrl && !cliOptions.forceBuildPreview,
    configType: 'PRODUCTION',
    cache,
    packageJson: readUpResult.packageJson,
  };
  await withTelemetry('build', { cliOptions, presetOptions: options }, () =>
    buildStaticStandalone(options)
  );
};

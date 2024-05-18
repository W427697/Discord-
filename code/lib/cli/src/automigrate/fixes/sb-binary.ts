import chalk from 'chalk';
import { dedent } from 'ts-dedent';
import type { Fix } from '../types';
import { getStorybookVersionSpecifier } from '../../helpers';
import type { PackageJsonWithDepsAndDevDeps } from '@storybook/core/dist/common';

interface SbBinaryRunOptions {
  storybookVersion: string;
  hasSbBinary: boolean;
  hasStorybookBinary: boolean;
  packageJson: PackageJsonWithDepsAndDevDeps;
}

const logger = console;

/**
 * Does the user not have storybook dependency?
 *
 * If so:
 * - Add storybook dependency
 * - If they are using sb dependency, remove it
 */
export const sbBinary: Fix<SbBinaryRunOptions> = {
  id: 'storybook-binary',

  versionRange: ['<7', '>=7'],

  async check({ packageManager, storybookVersion }) {
    const packageJson = await packageManager.retrievePackageJson();

    const nrwlStorybookVersion = await packageManager.getPackageVersion('@nrwl/storybook');
    const sbBinaryVersion = await packageManager.getPackageVersion('sb');
    const storybookBinaryVersion = await packageManager.getPackageVersion('storybook');

    // Nx provides their own binary, so we don't need to do anything
    if (nrwlStorybookVersion) {
      return null;
    }

    const hasSbBinary = !!sbBinaryVersion;
    const hasStorybookBinary = !!storybookBinaryVersion;

    if (!hasSbBinary && hasStorybookBinary) {
      return null;
    }

    return {
      hasSbBinary,
      hasStorybookBinary,
      storybookVersion,
      packageJson,
    };
  },

  prompt({ storybookVersion, hasSbBinary, hasStorybookBinary }) {
    const sbFormatted = chalk.cyan(`Storybook ${storybookVersion}`);

    const storybookBinaryMessage = !hasStorybookBinary
      ? `We've detected you are using ${sbFormatted} without Storybook's ${chalk.magenta(
          'storybook'
        )} binary. Starting in Storybook 7.0, it has to be installed.`
      : '';

    const extraMessage = hasSbBinary
      ? "You're using the 'sb' binary and it should be replaced, as 'storybook' is the recommended way to run Storybook.\n"
      : '';

    return dedent`
      ${storybookBinaryMessage}
      ${extraMessage}

      More info: ${chalk.yellow(
        'https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#start-storybook--build-storybook-binaries-removed'
      )}
      `;
  },

  async run({
    result: { packageJson, hasSbBinary, hasStorybookBinary },
    packageManager,
    dryRun,
    skipInstall,
  }) {
    if (hasSbBinary) {
      logger.info(`✅ Removing 'sb' dependency`);
      if (!dryRun) {
        await packageManager.removeDependencies(
          { skipInstall: skipInstall || !hasStorybookBinary, packageJson },
          ['sb']
        );
      }
    }

    if (!hasStorybookBinary) {
      logger.log();
      logger.info(`✅ Adding 'storybook' as dev dependency`);
      logger.log();
      if (!dryRun) {
        const versionToInstall = getStorybookVersionSpecifier(packageJson);
        await packageManager.addDependencies(
          { installAsDevDependencies: true, packageJson, skipInstall },
          [`storybook@${versionToInstall}`]
        );
      }
    }
  },
};

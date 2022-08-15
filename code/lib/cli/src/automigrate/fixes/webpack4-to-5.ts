import chalk from 'chalk';
import { dedent } from 'ts-dedent';
import semver from '@storybook/semver';
import { getStorybookInfo } from '@storybook/core-common';
import { Fix } from '../types';

const logger = console;

/**
 * Is the user using webpack4to5 in their project?
 *
 * If the user is using a version of SB >= 7.0,
 * prompt them to upgrade to webpack4to5.
 */
export const webpack4to5: Fix = {
  id: 'webpack4to5',

  async check({ packageManager }) {
    const packageJson = packageManager.retrievePackageJson();
    const { version: storybookVersion } = getStorybookInfo(packageJson);

    const storybookCoerced = storybookVersion && semver.coerce(storybookVersion)?.version;
    if (!storybookCoerced) {
      logger.warn(dedent`
        ❌ Unable to determine storybook version, skipping ${chalk.cyan('webpack4to5')} fix.
        🤔 Are you running automigrate from your project directory?
      `);
      return null;
    }

    if (semver.lt(storybookCoerced, '7.0.0')) {
      return null;
    }
    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    // TODO Webpack check logic
    const shouldPrompt = true;

    return shouldPrompt ? true : null;
  },

  prompt() {
    return dedent`
      We've detected you're using Storybook with a Webpack 4 builder.
      Starting in Storybook 7, Webpack 4 is not supported.
      
      You must upgrade your Storybook builder to use Webpack 5, and unfortunately we cannot upgrade your settings automatically.

      Please follow the instructions here to migrate your project: ${chalk.yellow(
        'https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#webpack4-support-discontinued'
      )}
    `;
  },
};

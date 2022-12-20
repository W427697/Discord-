import chalk from 'chalk';
import dedent from 'ts-dedent';
import semver from 'semver';
import { getStorybookInfo } from '@storybook/core-common';
import { loadPartialConfigAsync } from '@babel/core';
import { readConfig } from '@storybook/csf-tools';
import type { Fix } from '../types';

interface MissingBabelRcOptions {
  needsBabelRc: boolean;
}

const logger = console;

const frameworksThatNeedBabelConfig = [
  '@storybook/angular',
  '@storybook/react-webpack5',
  '@storybook/vue-webpack5',
  '@storybook/vue3-webpack5',
  '@storybook/preact-webpack5',
  '@storybook/html-webpack5',
  '@storybook/react-vite',
  '@storybook/vue-vite',
  '@storybook/vue3-vite',
  '@storybook/preact-vite',
  '@storybook/html-vite',
];

export const missingBabelRc: Fix<MissingBabelRcOptions> = {
  id: 'missing-babelrc',
  promptOnly: true,

  async check({ packageManager }) {
    const packageJson = packageManager.retrievePackageJson();
    const { mainConfig, version: storybookVersion } = getStorybookInfo(packageJson);

    const storybookCoerced = storybookVersion && semver.coerce(storybookVersion)?.version;
    if (!storybookCoerced) {
      throw new Error(dedent`
        ❌ Unable to determine storybook version.
        🤔 Are you running automigrate from your project directory?
      `);
    }

    if (!semver.gte(storybookCoerced, '7.0.0')) {
      return null;
    }

    if (!mainConfig) {
      logger.warn('Unable to find storybook main.js config, skipping');
      return null;
    }

    const main = await readConfig(mainConfig);

    const frameworkField = main.getFieldValue(['framework']);
    const frameworkPackage =
      typeof frameworkField === 'string' ? frameworkField : frameworkField?.name;

    if (frameworksThatNeedBabelConfig.includes(frameworkPackage)) {
      const config = await loadPartialConfigAsync();
      if (!config.config && !packageJson.babel) {
        return { needsBabelRc: true };
      }
    }

    return null;
  },
  prompt() {
    return dedent`
      ${chalk.bold(
        chalk.red('Attention')
      )}: We could not automatically make this change. You'll need to do it manually.

      Storybook now uses Babel mode v7 exclusively. In 6.x, Storybook provided its own babel settings out of the box. Now, Storybook's uses your project's babel settings (.babelrc, babel.config.js, etc.) instead.

      In the new mode, Storybook expects you to provide a configuration file. If you want a configuration file that's equivalent to the 6.x default, you can run the following command in your project directory:

      ${chalk.blue('npx sb@next babelrc')}

      This will create a ${chalk.blue(
        '.babelrc.json'
      )} file with some basic configuration and add new package devDependencies accordingly.

      Please see the migration guide for more information:
      ${chalk.yellow(
        'https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#babel-mode-v7-exclusively'
      )}
    `;
  },
};

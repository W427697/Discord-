import chalk from 'chalk';
import dedent from 'ts-dedent';
import semver from 'semver';
import type { ConfigFile } from '@storybook/csf-tools';
import { readConfig, writeConfig } from '@storybook/csf-tools';
import { getStorybookInfo } from '@storybook/core-common';

import type { Fix } from '../types';
import type { PackageJsonWithDepsAndDevDeps } from '../../js-package-manager';
import { getStorybookVersionSpecifier } from '../../helpers';

const logger = console;

interface SvelteKitFrameworkRunOptions {
  main: ConfigFile;
  packageJson: PackageJsonWithDepsAndDevDeps;
  frameworkOptions: Record<string, any> | undefined;
}

const fixId = 'sveltekitFramework';

/**
 * Does the user have a SvelteKit project but is using @storybook/svelte-vite instead of the @storybook/sveltekit framework?
 *
 * If so:
 * - Remove the dependencies (@storybook/svelte-vite)
 * - Add the dependencies (@storybook/sveltekit)
 * - Update StorybookConfig type import (if it exists) from svelte-vite to sveltekit
 * - Update the main config to use the new framework
 */
export const sveltekitFramework: Fix<SvelteKitFrameworkRunOptions> = {
  id: fixId,

  async check({ packageManager }) {
    const packageJson = packageManager.retrievePackageJson();
    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    if (!allDeps['@sveltejs/kit']) {
      return null;
    }

    const { mainConfig, version: storybookVersion } = getStorybookInfo(packageJson);
    if (!mainConfig) {
      logger.warn('Unable to find storybook main.js config, skipping');
      return null;
    }

    const sbVersionCoerced = storybookVersion && semver.coerce(storybookVersion)?.version;
    if (!sbVersionCoerced) {
      logger.warn(dedent`
        ❌ Unable to determine Storybook version, skipping ${chalk.cyan(fixId)} fix.
        🤔 Are you running automigrate from your project directory?
      `);
      return null;
    }

    if (!semver.gte(sbVersionCoerced, '7.0.0')) {
      return null;
    }

    const main = await readConfig(mainConfig);

    const frameworkPackage = main.getFieldValue(['framework']);

    if (!frameworkPackage) {
      // TODO: warn something here?
      return null;
    }

    const frameworkPackageName =
      typeof frameworkPackage === 'string' ? frameworkPackage : frameworkPackage.name;

    // we only migrate from svelte-vite projects
    if (frameworkPackageName !== '@storybook/svelte-vite') {
      logger.warn(dedent`
        We've detected you are using Storybook in a SvelteKit project.

        In Storybook 7, we introduced a new framework package for SvelteKit projects: @storybook/sveltekit.

        This package provides a better experience for SvelteKit users, however it is only compatible with the Vite builder, so we can't automigrate for you, as you are using another builder.
        
        If you are interested in using this package, see: ${chalk.yellow(
          'https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#sveltekit-needs-the-storybooksveltekit-framework'
        )}
      `);

      return null;
    }

    const frameworkOptions = main.getFieldValue(['framework', 'options']);

    return {
      main,
      frameworkOptions,
      packageJson,
    };
  },

  prompt() {
    return dedent`
      We've detected you are using Storybook in a SvelteKit project.

      In Storybook 7, we introduced a new framework package for SvelteKit projects: @storybook/sveltekit
      This package is a replacement for @storybook/svelte-vite and provides a better experience for SvelteKit users.

      We can automatically migrate your project to use the new SvelteKit framework package.

      To learn more about this change, see: ${chalk.yellow(
        'https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#sveltekit-needs-the-storybooksveltekit-framework'
      )}
    `;
  },

  async run({ result: { main, frameworkOptions, packageJson }, packageManager, dryRun }) {
    const dependenciesToRemove = ['@storybook/svelte-vite'];
    logger.info(`✅ Removing redundant packages: ${dependenciesToRemove.join(', ')}`);
    if (!dryRun) {
      packageManager.removeDependencies({ skipInstall: true, packageJson }, dependenciesToRemove);
    }

    logger.info(`✅ Installing new dependencies: @storybook/sveltekit`);
    if (!dryRun) {
      const versionToInstall = getStorybookVersionSpecifier(packageJson);
      packageManager.addDependencies({ installAsDevDependencies: true, packageJson }, [
        `@storybook/sveltekit@${versionToInstall}`,
      ]);
    }

    logger.info(`✅ Updating framework field in main.js`);
    if (!dryRun) {
      if (frameworkOptions) {
        main.setFieldValue(['framework', 'options'], frameworkOptions);
        main.setFieldValue(['framework', 'name'], '@storybook/sveltekit');
      } else {
        main.setFieldValue(['framework'], '@storybook/sveltekit');
      }

      await writeConfig(main);
    }
  },
};

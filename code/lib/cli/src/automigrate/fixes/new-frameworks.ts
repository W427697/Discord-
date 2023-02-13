import chalk from 'chalk';
import dedent from 'ts-dedent';
import semver from 'semver';
import { readConfig, writeConfig } from '@storybook/csf-tools';
import type { Preset } from '@storybook/types';
import { getStorybookInfo, loadMainConfig, rendererPackages } from '@storybook/core-common';

import type { Fix } from '../types';
import type { PackageJsonWithDepsAndDevDeps } from '../../js-package-manager';
import { getStorybookVersionSpecifier } from '../../helpers';
import { detectRenderer } from '../helpers/detectRenderer';

const logger = console;

const packagesMap: Record<string, { webpack5?: string; vite?: string }> = {
  '@storybook/react': {
    webpack5: '@storybook/react-webpack5',
    vite: '@storybook/react-vite',
  },
  '@storybook/preact': {
    webpack5: '@storybook/preact-webpack5',
    vite: '@storybook/preact-vite',
  },
  '@storybook/server': {
    webpack5: '@storybook/server-webpack5',
  },
  '@storybook/ember': {
    webpack5: '@storybook/ember',
  },
  '@storybook/angular': {
    webpack5: '@storybook/angular',
  },
  '@storybook/vue': {
    webpack5: '@storybook/vue-webpack5',
    vite: '@storybook/vue-vite',
  },
  '@storybook/vue3': {
    webpack5: '@storybook/vue3-webpack5',
    vite: '@storybook/vue3-vite',
  },
  '@storybook/svelte': {
    webpack5: '@storybook/svelte-webpack5',
    vite: '@storybook/svelte-vite',
  },
  '@storybook/web-components': {
    webpack5: '@storybook/web-components-webpack5',
    vite: '@storybook/web-components-vite',
  },
  '@storybook/html': {
    webpack5: '@storybook/html-webpack5',
    vite: '@storybook/html-vite',
  },
};

interface NewFrameworkRunOptions {
  mainConfigPath: string;
  packageJson: PackageJsonWithDepsAndDevDeps;
  dependenciesToAdd: string[];
  dependenciesToRemove: string[];
  hasFrameworkInMainConfig: boolean;
  frameworkPackage: string;
  renderer: string;
  frameworkOptions: Record<string, any>;
  builderInfo: {
    name: string;
    options: Record<string, any>;
  };
}

export const getBuilderInfo = (
  builder: string | Preset
): { name: 'vite' | 'webpack5'; options: any } => {
  if (typeof builder === 'string') {
    return {
      name: builder.includes('vite') ? 'vite' : 'webpack5',
      options: {},
    };
  }

  return {
    name: builder?.name.includes('vite') ? 'vite' : 'webpack5',
    options: builder?.options || {},
  };
};

/**
 * Does the user have separate framework and builders (e.g. @storybook/react + core.builder -> webpack5)?
 *
 * If so:
 * - Remove the dependencies (@storybook/react + @storybook/builder-webpack5 + @storybook/manager-webpack5)
 * - Install the correct new package e.g. (@storybook/react-webpack5)
 * - Update the main config to use the new framework
 * -- moving core.builder into framework.options.builder
 * -- moving renderer options (e.g. reactOptions) into framework.options
 * -- removing the now unnecessary fields in main.js
 */
export const newFrameworks: Fix<NewFrameworkRunOptions> = {
  id: 'newFrameworks',

  async check({
    packageManager,
    configDir: userDefinedConfigDir,
    rendererPackage: userDefinedRendererPackage,
  }) {
    const packageJson = packageManager.retrievePackageJson();
    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    const {
      mainConfig: mainConfigPath,
      version: storybookVersion,
      configDir: configDirFromScript,
    } = getStorybookInfo(packageJson, userDefinedConfigDir);

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

    const configDir = userDefinedConfigDir || configDirFromScript;
    let mainConfig;
    try {
      mainConfig = await loadMainConfig({ configDir });
    } catch (err) {
      throw new Error(
        dedent`Unable to find or evaluate ${chalk.blue(mainConfigPath)}: ${err.message}`
      );
    }

    const frameworkPackage =
      typeof mainConfig.framework === 'string' ? mainConfig.framework : mainConfig.framework?.name;

    const hasFrameworkInMainConfig = !!frameworkPackage;

    // if --renderer is passed to the command, just use it.
    // Useful for monorepo projects to automate the script without getting prompts
    let rendererPackage = userDefinedRendererPackage;
    if (!rendererPackage) {
      // at some point in 6.4 we introduced a framework field, but filled with a renderer package
      if (frameworkPackage && Object.keys(rendererPackages).includes(frameworkPackage)) {
        rendererPackage = frameworkPackage;
      } else {
        // detect the renderer package from the user's dependencies, and if multiple are there (monorepo), prompt the user to choose
        rendererPackage = await detectRenderer(packageJson);
      }
    }

    const builder = mainConfig.core?.builder;

    // bail if we can't detect an official renderer
    const supportedPackages = Object.keys(packagesMap);
    if (!supportedPackages.includes(rendererPackage)) {
      return null;
    }

    const builderInfo = getBuilderInfo(builder);

    const newFrameworkPackage = packagesMap[rendererPackage][builderInfo.name];

    // bail if there is no framework that matches the renderer + builder
    if (!newFrameworkPackage) {
      return null;
    }

    const renderer = rendererPackages[rendererPackage];
    // @ts-expect-error account for renderer options for packages that supported it: reactOptions, angularOptions, svelteOptions
    const frameworkOptions = mainConfig[`${renderer}Options`];

    const dependenciesToRemove = [
      '@storybook/builder-webpack5',
      '@storybook/manager-webpack5',
      '@storybook/builder-webpack4',
      '@storybook/manager-webpack4',
      '@storybook/builder-vite',
      'storybook-builder-vite',
    ].filter((dep) => allDeps[dep]);

    const dependenciesToAdd = [];

    // some frameworks didn't change e.g. Angular, Ember
    if (newFrameworkPackage !== frameworkPackage && !allDeps[newFrameworkPackage]) {
      dependenciesToAdd.push(newFrameworkPackage);
    }

    const isProjectAlreadyCorrect =
      hasFrameworkInMainConfig &&
      !frameworkOptions &&
      !dependenciesToRemove.length &&
      !dependenciesToAdd.length;

    if (isProjectAlreadyCorrect) {
      return null;
    }

    if (allDeps.vite && semver.lt(semver.coerce(allDeps.vite).version, '3.0.0')) {
      throw new Error(dedent`
        ❌ Your project should be upgraded to use the framework package ${chalk.bold(
          newFrameworkPackage
        )}, but we detected that you are using Vite ${chalk.bold(
        allDeps.vite
      )}, which is unsupported in ${chalk.bold(
        'Storybook 7.0'
      )}. Please upgrade Vite to ${chalk.bold('3.0.0 or higher')} and rerun this migration.
      `);
    }

    return {
      mainConfigPath,
      dependenciesToAdd,
      dependenciesToRemove,
      frameworkPackage: newFrameworkPackage,
      hasFrameworkInMainConfig,
      frameworkOptions,
      builderInfo,
      packageJson,
      renderer,
      builder,
    };
  },

  prompt({
    dependenciesToRemove,
    dependenciesToAdd,
    hasFrameworkInMainConfig,
    mainConfigPath,
    frameworkPackage,
    frameworkOptions,
    renderer,
  }) {
    let disclaimer = '';
    let migrationSteps = `- Set up the ${chalk.magenta(frameworkPackage)} framework\n`;

    if (dependenciesToRemove.length > 0) {
      migrationSteps += `- Remove the following dependencies: ${chalk.yellow(
        dependenciesToRemove.join(', ')
      )}\n`;
    }

    if (dependenciesToAdd.length > 0) {
      migrationSteps += `- Add the following dependencies: ${chalk.yellow(
        dependenciesToAdd.join(', ')
      )}\n`;
    }

    if (!hasFrameworkInMainConfig) {
      migrationSteps += `- Specify a ${chalk.yellow('framework')} field in ${chalk.blue(
        mainConfigPath
      )}, which is a requirement in SB7.0 and above.\n`;
    }

    if (frameworkOptions) {
      migrationSteps += `- Move the ${chalk.yellow(`${renderer}Options`)} field from ${chalk.blue(
        mainConfigPath
      )} to the ${chalk.yellow('framework.options')} field.
      More info: ${chalk.yellow(
        'https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#frameworkoptions-renamed'
      )}\n`;
    }

    if (
      dependenciesToRemove.includes('@storybook/builder-webpack4') ||
      dependenciesToRemove.includes('@storybook/manager-webpack4')
    ) {
      disclaimer = dedent`\n\n\n${chalk.underline(chalk.bold(chalk.cyan('Webpack4 users')))}

      Unless you're using Storybook's Vite builder, this automigration will install a Webpack5-based framework.
      
      Given you were using Storybook's Webpack4 builder (default in 6.x, discontinued in 7.0), this could be a breaking change -- especially if your project has a custom webpack configuration.
      
      To learn more about migrating from Webpack4, see: ${chalk.yellow(
        'https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#webpack4-support-discontinued'
      )}`;
    }

    return dedent`
      We've detected you are using an older format of Storybook frameworks and builders.

      In Storybook 7, frameworks also specify the builder to be used.

      Here are the steps we'll take to migrate your project:
      ${migrationSteps}

      To learn more about the new framework format, see: ${chalk.yellow(
        'https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#framework-field-mandatory'
      )}${disclaimer}
    `;
  },

  async run({
    result: {
      dependenciesToAdd,
      dependenciesToRemove,
      mainConfigPath,
      frameworkPackage,
      frameworkOptions,
      builderInfo,
      packageJson,
      renderer,
    },
    packageManager,
    dryRun,
  }) {
    if (dependenciesToRemove.length > 0) {
      logger.info(`✅ Removing dependencies: ${dependenciesToRemove.join(', ')}`);
      if (!dryRun) {
        packageManager.removeDependencies(
          { skipInstall: dependenciesToAdd.length > 0, packageJson },
          dependenciesToRemove
        );
      }
    }

    if (dependenciesToAdd.length > 0) {
      logger.info(`✅ Installing new dependencies: ${dependenciesToAdd.join(', ')}`);
      if (!dryRun) {
        const versionToInstall = getStorybookVersionSpecifier(packageJson);
        const depsToAdd = dependenciesToAdd.map((dep) => `${dep}@${versionToInstall}`);
        packageManager.addDependencies({ installAsDevDependencies: true }, depsToAdd);
      }
    }

    if (!dryRun) {
      try {
        logger.info(`✅ Updating framework field in main.js`);
        const main = await readConfig(mainConfigPath);

        main.setFieldValue(['framework', 'name'], frameworkPackage);

        if (frameworkOptions) {
          main.setFieldValue(['framework', 'options'], frameworkOptions);
          main.removeField([`${renderer}Options`]);
        }

        const builder = main.getFieldNode(['core', 'builder']);
        if (builder) {
          main.removeField(['core', 'builder']);
        }

        if (frameworkPackage === '@storybook/svelte-vite' && main.getFieldNode(['svelteOptions'])) {
          logger.info(`✅ Removing svelteOptions field in main.js`);
          main.removeField(['svelteOptions']);
        }

        if (Object.keys(builderInfo.options).length > 0) {
          main.setFieldValue(['framework', 'options', 'builder'], builderInfo.options);
        }

        const currentCore = main.getFieldValue(['core']);
        if (currentCore) {
          if (Object.keys(currentCore).length === 0) {
            main.removeField(['core']);
          } else {
            main.setFieldValue(['core'], currentCore);
          }
        }

        await writeConfig(main);
      } catch (e) {
        logger.info(
          `❌ The "${this.id}" migration failed to update your ${chalk.blue(
            mainConfigPath
          )} on your behalf. Please follow the instructions given previously and update the file manually.`
        );
      }
    }
  },
};

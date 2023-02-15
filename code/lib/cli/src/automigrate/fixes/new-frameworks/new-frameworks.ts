import chalk from 'chalk';
import dedent from 'ts-dedent';
import semver from 'semver';
import { readConfig, writeConfig } from '@storybook/csf-tools';
import { getStorybookInfo, loadMainConfig, rendererPackages } from '@storybook/core-common';

import type { Fix } from '../../types';
import type { PackageJsonWithDepsAndDevDeps } from '../../../js-package-manager';
import { getStorybookVersionSpecifier } from '../../../helpers';
import { detectRenderer } from '../../helpers/detectRenderer';
import type { Addon } from './utils';
import { getNextjsAddonOptions, getBuilderInfo, packagesMap } from './utils';
import { detectFramework } from '../../helpers/detectFramework';

const logger = console;

interface NewFrameworkRunOptions {
  mainConfigPath: string;
  packageJson: PackageJsonWithDepsAndDevDeps;
  allDependencies: Record<string, string>;
  dependenciesToAdd: string[];
  dependenciesToRemove: string[];
  hasFrameworkInMainConfig: boolean;
  frameworkPackage: string;
  renderer: string;
  addonsToRemove: string[];
  frameworkOptions: Record<string, any>;
  rendererOptions: Record<string, any>;
  addonOptions: Record<string, any>;
  builderConfig: string | Record<string, any>;
  builderInfo: {
    name: string;
    options: Record<string, any>;
  };
}

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
    const allDependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
      ...packageJson.peerDependencies,
    };

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

    let frameworkPackage =
      typeof mainConfig.framework === 'string' ? mainConfig.framework : mainConfig.framework?.name;
    const hasFrameworkInMainConfig = !!frameworkPackage;

    if (!hasFrameworkInMainConfig) {
      frameworkPackage = await detectFramework(packageJson);
      // This scenario will only happen when user's have things properly set up for SB 7
      // but do not contain a framework field in main.js
      if (frameworkPackage) {
        mainConfig.framework = frameworkPackage;
      }
    }

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

    const builderConfig = mainConfig.core?.builder;

    // bail if we can't detect an official renderer
    const supportedPackages = Object.keys(packagesMap);
    if (!supportedPackages.includes(rendererPackage)) {
      return null;
    }

    const builderInfo = getBuilderInfo(mainConfig);

    let newFrameworkPackage = packagesMap[rendererPackage][builderInfo.name];

    // bail if there is no framework that matches the renderer + builder
    if (!newFrameworkPackage) {
      return null;
    }

    const renderer = rendererPackages[rendererPackage];
    // @ts-expect-error account for renderer options for packages that supported it: reactOptions, angularOptions. (svelteOptions got removed)
    let rendererOptions = mainConfig[`${renderer}Options`] || {};

    const frameworkOptions =
      typeof mainConfig.framework === 'string' ? {} : mainConfig.framework?.options;

    let dependenciesToRemove = [
      '@storybook/builder-webpack5',
      '@storybook/manager-webpack5',
      '@storybook/builder-webpack4',
      '@storybook/manager-webpack4',
      '@storybook/builder-vite',
      'storybook-builder-vite',
    ];

    let dependenciesToAdd: string[] = [];
    let addonsToRemove: string[] = [];
    let addonOptions = {};

    // Next.js specific automigrations
    if (allDependencies.next && semver.gte(semver.coerce(allDependencies.next).version, '12.0.0')) {
      if (newFrameworkPackage === '@storybook/react-webpack5') {
        newFrameworkPackage = '@storybook/nextjs';
        addonOptions = getNextjsAddonOptions(mainConfig.addons);

        addonsToRemove = ['storybook-addon-next', 'storybook-addon-next-router'].filter(
          (dep) => allDependencies[dep]
        );

        dependenciesToRemove.push(
          // in case users are coming from a properly set up @storybook/webpack5 project
          '@storybook/react-webpack5',
          'storybook-addon-next',
          'storybook-addon-next-router'
        );
      }
    } else if (
      allDependencies['@sveltejs/kit'] &&
      semver.gte(semver.coerce(allDependencies['@sveltejs/kit']).version, '1.0.0')
    ) {
      if (newFrameworkPackage === '@storybook/svelte-vite') {
        newFrameworkPackage = '@storybook/svelte-kit';
        // in case svelteOptions are set, we remove them as they are not needed in svelte-kit
        rendererOptions = {};
        dependenciesToRemove.push(
          // in case users are coming from a properly set up @storybook/webpack5 project
          '@storybook/svelte-vite'
        );
      }
    }

    // some frameworks didn't change e.g. Angular, Ember
    if (newFrameworkPackage !== frameworkPackage && !allDependencies[newFrameworkPackage]) {
      dependenciesToAdd.push(newFrameworkPackage);
    }

    // only install what's not already installed
    dependenciesToAdd = dependenciesToAdd.filter((dep) => !allDependencies[dep]);
    // only uninstall what's installed
    dependenciesToRemove = dependenciesToRemove.filter((dep) => allDependencies[dep]);

    const isProjectAlreadyCorrect =
      hasFrameworkInMainConfig &&
      !builderConfig &&
      !Object.keys(rendererOptions).length &&
      !Object.keys(addonOptions).length &&
      !dependenciesToRemove.length &&
      !dependenciesToAdd.length;

    if (isProjectAlreadyCorrect) {
      return null;
    }

    if (allDependencies.vite && semver.lt(semver.coerce(allDependencies.vite).version, '3.0.0')) {
      throw new Error(dedent`
        ❌ Your project should be upgraded to use the framework package ${chalk.bold(
          newFrameworkPackage
        )}, but we detected that you are using Vite ${chalk.bold(
        allDependencies.vite
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
      frameworkOptions: {
        ...frameworkOptions,
        ...rendererOptions,
        ...addonOptions,
      },
      rendererOptions,
      addonOptions,
      addonsToRemove,
      builderInfo,
      packageJson,
      renderer,
      builderConfig,
      allDependencies,
    };
  },

  prompt({
    dependenciesToRemove,
    dependenciesToAdd,
    hasFrameworkInMainConfig,
    mainConfigPath,
    frameworkPackage,
    addonOptions,
    renderer,
    rendererOptions,
    builderConfig,
    addonsToRemove,
    allDependencies,
  }) {
    let disclaimer = '';
    let migrationSteps = '';

    if (dependenciesToRemove.length > 0) {
      migrationSteps += `- Remove the following dependencies:
      ${dependenciesToRemove.map((dep) => `- * ${chalk.cyan(dep)}`).join('\n')}\n`;
    }

    if (dependenciesToAdd.length > 0) {
      migrationSteps += `- Add the following dependencies: 
      ${dependenciesToAdd.map((dep) => `- * ${chalk.cyan(dep)}`).join('\n')}\n`;
    }

    if (!hasFrameworkInMainConfig) {
      migrationSteps += `- Specify a ${chalk.yellow('framework')} field in ${chalk.blue(
        mainConfigPath
      )} with the value of "${chalk.cyan(frameworkPackage)}".\n`;
    }

    if (Object.keys(rendererOptions).length > 0) {
      migrationSteps += `- Move the ${chalk.yellow(`${renderer}Options`)} field in ${chalk.blue(
        mainConfigPath
      )} to ${chalk.yellow('framework.options')}, and remove that field entirely.
      More info: ${chalk.yellow(
        'https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#frameworkoptions-renamed'
      )}\n`;
    }

    if (addonsToRemove.length > 0) {
      migrationSteps += `- Remove the following addons from your ${chalk.blue(
        mainConfigPath
      )}, as the new framework also supports features provided by them:
      ${addonsToRemove.map((dep) => `- * ${chalk.cyan(dep)}`).join('\n')}
      `;
    }

    if (Object.keys(addonOptions).length > 0) {
      migrationSteps += `- Move the addon options "${chalk.yellow(
        Object.keys(addonOptions).join(', ')
      )}" in ${chalk.blue(mainConfigPath)} to the ${chalk.yellow('framework.options')} field.\n`;
    }

    if (builderConfig) {
      if (typeof builderConfig === 'string') {
        migrationSteps += `- Remove the ${chalk.yellow('core.builder')} field in ${chalk.blue(
          mainConfigPath
        )}.\n`;
      } else if (Object.keys(builderConfig.options).length > 0) {
        migrationSteps += `- Move the ${chalk.yellow('core.builder.options')} field in ${chalk.blue(
          mainConfigPath
        )} to ${chalk.yellow('framework.options.builder')} and remove the ${chalk.yellow(
          'core.builder'
        )} field.\n`;
      }
    }

    if (
      dependenciesToRemove.includes('@storybook/builder-webpack4') ||
      dependenciesToRemove.includes('@storybook/manager-webpack4')
    ) {
      disclaimer = dedent`\n\n
      ${chalk.underline(chalk.bold(chalk.cyan('Webpack4 users')))}

      Unless you're using Storybook's Vite builder, this automigration will install a Webpack5-based framework.
      
      Given you were using Storybook's Webpack4 builder (default in 6.x, discontinued in 7.0), this could be a breaking change -- especially if your project has a custom webpack configuration.
      
      To learn more about migrating from Webpack4, see: ${chalk.yellow(
        'https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#webpack4-support-discontinued'
      )}`;
    }

    if (allDependencies.next && semver.gte(semver.coerce(allDependencies.next).version, '12.0.0')) {
      if (dependenciesToRemove.includes('storybook-addon-next-router')) {
        migrationSteps += `- Migrate the usage of the ${chalk.cyan(
          'storybook-addon-next-router'
        )} addon to use the APIs from the ${chalk.magenta(
          '@storybook/nextjs'
        )} framework package instead. Follow the instructions below.`;
      }

      if (frameworkPackage === '@storybook/react-vite') {
        disclaimer = dedent`\n\n
          ${chalk.bold('Important')}: We've detected you are using Storybook in a Next.js project.
  
          This migration is set to update your project to use the ${chalk.magenta(
            '@storybook/react-vite'
          )} framework, but Storybook provides a framework package specifically for Next.js projects: ${chalk.magenta(
          '@storybook/nextjs'
        )}.
  
          This package provides a better experience for Next.js users, however it is only compatible with the Webpack 5 builder, so we can't automigrate for you, as you are using the Vite builder.
          
          If you are interested in using this package, see: ${chalk.yellow(
            'https://github.com/storybookjs/storybook/blob/next/code/frameworks/nextjs/README.md'
          )}
        `;
      } else {
        disclaimer = dedent`\n\n
        The ${chalk.magenta(
          '@storybook/nextjs'
        )} package provides great user experience for Next.js users, and we highly recommend you to read more about it at ${chalk.yellow(
          'https://github.com/storybookjs/storybook/blob/next/code/frameworks/nextjs/README.md'
        )}
        `;
      }
    }

    if (
      allDependencies['@sveltejs/kit'] &&
      semver.gte(semver.coerce(allDependencies['@sveltejs/kit']).version, '1.0.0')
    ) {
      if (frameworkPackage === '@storybook/svelte-webpack5') {
        disclaimer = dedent`\n\n
          ${chalk.bold(
            'Important'
          )}: We've detected you are using Storybook in a Svelte kit project.
  
          This migration is set to update your project to use the ${chalk.magenta(
            '@storybook/svelte-webpack5'
          )} framework, but Storybook provides a framework package specifically for Svelte kit projects: ${chalk.magenta(
          '@storybook/sveltekit'
        )}.
  
          This package provides a better experience for Svelte kit users, however it is only compatible with the Vite builder, so we can't automigrate for you, as you are using the Webpack builder.
          
          If you are interested in using this package, see: ${chalk.yellow(
            'https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#sveltekit-needs-the-storybooksveltekit-framework'
          )}
        `;
      } else {
        disclaimer = dedent`\n\n
        The ${chalk.magenta(
          '@storybook/sveltekit'
        )} package provides great user experience for Svelte kit users, and we highly recommend you to read more about it at ${chalk.yellow(
          'https://github.com/storybookjs/storybook/blob/next/code/frameworks/sveltekit/README.md'
        )}
        `;
      }
    }

    return dedent`
      We've detected you are using an older format of Storybook renderers and builders.

      Storybook 7 introduced the concept of frameworks, which abstracts configuration for renderers (e.g. React, Vue), builders (e.g. Webpack, Vite) and defaults to make integrations easier.

      Your project should be updated to use Storybook's framework: ${chalk.magenta(
        frameworkPackage
      )}. We can attempt to do this for you automatically.

      Here are the steps this migration will do to migrate your project:
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
      addonsToRemove,
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

    try {
      const main = await readConfig(mainConfigPath);
      logger.info(`✅ Updating main.js`);

      logger.info(`✅ Updating "framework" field`);
      if (!dryRun) {
        main.setFieldValue(['framework', 'name'], frameworkPackage);
      }

      if (Object.keys(frameworkOptions).length > 0) {
        main.setFieldValue(['framework', 'options'], frameworkOptions);

        if (main.getFieldNode([`${renderer}Options`])) {
          logger.info(`✅ Moving "${renderer}Options" to "framework.options"`);
          if (!dryRun) {
            main.removeField([`${renderer}Options`]);
          }
        }
      }

      const builder = main.getFieldNode(['core', 'builder']);
      if (builder) {
        logger.info(`✅ Removing "core.builder" field`);
        if (!dryRun) {
          main.removeField(['core', 'builder']);
        }
      }

      if (Object.keys(builderInfo.options).length > 0) {
        logger.info(`✅ Moving "core.builder.options" into "framework.options.builder"`);
        if (!dryRun) {
          main.setFieldValue(['framework', 'options', 'builder'], builderInfo.options);
        }
      }

      const currentCore = main.getFieldValue(['core']);
      if (currentCore) {
        if (Object.keys(currentCore).length === 0) {
          logger.info(`✅ Removing "core" field`);
          if (!dryRun) {
            main.removeField(['core']);
          }
        }
      }

      if (addonsToRemove.length > 0) {
        const existingAddons = main.getFieldValue(['addons']) as Addon[];
        const updatedAddons = existingAddons.filter((addon) => {
          if (typeof addon === 'string') {
            return !addonsToRemove.includes(addon);
          }
          if (addon.name) {
            return !addonsToRemove.includes(addon.name);
          }

          return false;
        });
        logger.info(`✅ Removing unnecessary addons`);
        if (!dryRun) {
          main.setFieldValue(['addons'], updatedAddons);
        }
      }

      if (!dryRun) {
        await writeConfig(main);
      }
    } catch (e) {
      logger.info(
        `❌ The "${this.id}" migration failed to update your ${chalk.blue(
          mainConfigPath
        )} on your behalf because of the following error:
          ${e}`
      );
      logger.info(
        `⚠️ Storybook automigrations are based on AST parsing and it's possible that your ${chalk.blue(
          mainConfigPath
        )} file contains a non-standard format or that there was an error when parsing dynamic values (e.g. "require" calls, or usage of environment variables). Please follow the instructions given previously and update the file manually.`
      );
    }
  },
};

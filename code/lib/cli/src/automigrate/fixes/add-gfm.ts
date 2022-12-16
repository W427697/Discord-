import { dedent } from 'ts-dedent';
import { getStorybookInfo } from '@storybook/core-common';

import { readConfig, writeConfig } from '@storybook/csf-tools';
import type { ConfigFile } from '@storybook/csf-tools';
import type { Preset } from 'lib/types/src';
import type { Fix } from '../types';

interface AddGFMOptions {
  main: ConfigFile;
}

const logger = console;

/**
 * does do user want GFM added as a remark plugin?
 */
export const addGFM: Fix<AddGFMOptions> = {
  id: 'addGFM',

  async check({ packageManager }) {
    const packageJson = packageManager.retrievePackageJson();

    const installedDependencies = new Set(
      Object.keys({ ...packageJson.dependencies, ...packageJson.devDependencies })
    );
    const isUserUsingEssentialOrDocs =
      installedDependencies.has('@storybook/addon-docs') ||
      installedDependencies.has('@storybook/addon-essentials');

    const { mainConfig } = getStorybookInfo(packageJson);
    if (!mainConfig) {
      logger.warn('Unable to find storybook main.js config, skipping');
      return null;
    }

    const main = await readConfig(mainConfig);

    // console.log(main);

    // TODO
    const addons: Preset[] = main.getFieldValue(['addons']);

    const found = addons.findIndex((addon: Preset) => {
      if (typeof addon === 'string' && addon === '@storybook/addon-docs') {
        return true;
      }
      if (typeof addon !== 'string' && addon.name === '@storybook/addon-docs') {
        return true;
      }
      return false;
    });

    // how about we don't do any of this?
    // how about we create a new preset we can have users install
    // and this preset adds the runtime config, instead of me trying to generate the code into a very unknown environment
    // the main.js/main.ts file is really really complex.
    // unless we already have a way of generating runtime code in there such as:
    /**
     * ```
     * // main.js
     * module.exports = {
     *   addons: [{
     *     name: ‘@storybook/addon-docs’,
     *     options: {
     *       mdxCompileOptions: {
     *         remarkPlugins: [require('remark-gfm')],
     *       },
     *     }
     *   }]
     * };
     * ```
     *
     * This type of code generation is hard, because
     * I might have to do a declarative inport at the top
     * I might have to do a require
     * This could be based on typescript config/setting
     * This could be based on the file extention
     * This could be based on the package.json's type field.
     *
     * I don't want to burn my hands and sink hours upon hours, trying to allow for all those scenarios.
     *
     * I suggest I add this:
     * ```
     * // main.js
     * module.exports = {
     *   addons: [‘@storybook/addon-gfm']
     * };
     * ```
     *
     * And call it a day! That addon/code is fully under our control and just needs to import the right thing and expose a preset with the right property/value
     * done
     */

    if (found !== -1) {
      addons.splice(found, 1, {});
    }

    const doesConfigFileContainGFM = false;

    if (isUserUsingEssentialOrDocs && !doesConfigFileContainGFM) {
      return { main };
    }

    return null;
  },

  prompt() {
    return dedent`
      Would you like to use Github-Flavoured-Markdown (GFM) in your docs?
    `;
  },

  async run({ packageManager, result: { main }, dryRun }) {
    if (!dryRun) {
      // get the ast of the main
      // add an import to the top of the file
      // find a preset entry of docs -> modify it
      // - or - add a new one
      // generate the code

      packageManager.addDependencies({ installAsDevDependencies: true }, ['remark-gfm']);
    }
  },
};

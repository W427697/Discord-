import chalk from 'chalk';
import { dedent } from 'ts-dedent';
import semver from 'semver';
import type { Fix } from '../types';
import { getStorybookData } from '../helpers/mainConfigFile';

interface AngularExecutorsRunOptions {
  angularVersion: string;
}

/**
 * Is the user coming from a deprecated Storybook Angular project format?
 *
 * If so:
 * - XYZ
 */
export const angularExecutors: Fix<AngularExecutorsRunOptions> = {
  id: 'angular-executors',

  async check({ packageManager, configDir }) {
    // Angular Executors - CHECK
    // Is this project using NX? Skip it for now
    // Is Angular version lower than 14? -> throw an error (only supports ng 14)
    // Is Angular version higher than 14? Then go ahead
    // Does the package.json contain storybook scripts and/or compodoc script?
    // Is the project.json structure correct?

    const allDependencies = packageManager.getAllDependencies();
    const angularVersion = allDependencies['@angular/core'];
    const angularCoerced = semver.coerce(angularVersion)?.version;

    // skip non-angular projects
    if (!angularCoerced) {
      return null;
    }

    if (semver.lt(angularCoerced, '14.0.0')) {
      return { angularVersion };
    }

    const { mainConfig } = await getStorybookData({ configDir, packageManager });

    return {};
  },

  prompt({ angularVersion }) {
    // Angular Executors - PROMPT
    // NX - Unsupported for now
    // Angular lower than 14 - Unsupported
    // Your project.json structure is not supported
    // The actual automigration

    return dedent``;
  },

  async run({ result, dryRun }) {
    // do actual changes
  },
};

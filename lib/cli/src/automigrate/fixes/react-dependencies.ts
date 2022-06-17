import chalk from 'chalk';
import dedent from 'ts-dedent';

import { Fix } from '../types';
import { PackageJsonWithDepsAndDevDeps } from '../../js-package-manager';
import { isDependencyInstalled } from '../helpers/is-dependency-installed';

const logger = console;

interface CheckDependenciesRunOptions {
  dependenciesToInstall: string[];
}

interface CheckDependencies {
  checkReactDependencies: (packageJson: PackageJsonWithDepsAndDevDeps) => Promise<string[]>;
}

/**
 * Is the user using react and react-dom in their project?
 *
 * If not,
 * prompt them to install them as dev dependencies. Biggest motivation is to avoid
 * possible conflicts with tools like npm 8.
 *
 */
export const reactDependencies: Fix<CheckDependenciesRunOptions> & CheckDependencies = {
  id: 'reactDependencies',

  async checkReactDependencies(packageJson: PackageJsonWithDepsAndDevDeps) {
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
      ...packageJson.peerDependencies,
    };

    if (allDeps.react && allDeps['react-dom']) {
      return null;
    }

    const dependenciesToInstall: string[] = [];

    ['react', 'react-dom'].forEach((dep) => {
      if (!isDependencyInstalled(dep)) {
        dependenciesToInstall.push(dep);
      }
    });

    return dependenciesToInstall.length > 0 ? dependenciesToInstall : null;
  },

  async check({ packageManager }) {
    const packageJson = packageManager.retrievePackageJson();

    const dependenciesToInstall = await this.checkReactDependencies(packageJson);
    return dependenciesToInstall ? { dependenciesToInstall } : null;
  },

  prompt({ dependenciesToInstall }) {
    const dependencies = chalk.cyan(dependenciesToInstall.join(' and '));

    return dedent`
      We've detected you don't have ${dependencies} installed.
      Due to changes in modern package managers (e.g. npm8) we now recommend that you install these as dev dependencies in your project. We can do this automatically for you.
    `;
  },

  async run({ result: { dependenciesToInstall }, packageManager, dryRun }) {
    logger.info(`✅ Adding dependencies: ${dependenciesToInstall}`);
    if (!dryRun) {
      packageManager.addDependencies({ installAsDevDependencies: true }, dependenciesToInstall);
    }
  },
};

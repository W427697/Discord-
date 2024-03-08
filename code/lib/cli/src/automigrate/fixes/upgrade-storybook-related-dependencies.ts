import { dedent } from 'ts-dedent';
import type { Fix } from '../types';
import { cyan, yellow } from 'chalk';
import { getIncompatibleStorybookPackages } from '../../doctor/getIncompatibleStorybookPackages';
import { valid, coerce } from 'semver';
import type { JsPackageManager } from '@storybook/core-common';
import { isCorePackage } from '@storybook/core-common';

type PackageMetadata = {
  packageName: string;
  beforeVersion: string;
  afterVersion: string | null;
};

interface Options {
  upgradable: PackageMetadata[];
  problematicPackages: PackageMetadata[];
}

async function getLatestVersions(
  packageManager: JsPackageManager,
  packages: [string, string][]
): Promise<PackageMetadata[]> {
  return Promise.all(
    packages.map(async ([packageName, beforeVersion]) => ({
      packageName,
      beforeVersion,
      afterVersion: await packageManager.latestVersion(packageName).catch(() => null),
    }))
  );
}

function isPackageUpgradable(
  version: string,
  packageName: string,
  allDependencies: Record<string, string>
) {
  const installedVersion = coerce(allDependencies[packageName])?.toString();

  return valid(version) && version !== installedVersion;
}

function categorizePackages(
  packageVersions: PackageMetadata[],
  allDependencies: Record<string, string>
) {
  return packageVersions.reduce(
    (acc, { packageName, afterVersion, beforeVersion }) => {
      if (afterVersion === null) return acc;

      const isUpgradable = isPackageUpgradable(afterVersion, packageName, allDependencies);
      const category = isUpgradable ? 'upgradable' : 'problematicPackages';
      acc[category].push({ packageName, afterVersion, beforeVersion });

      return acc;
    },
    { upgradable: [], problematicPackages: [] } as Options
  );
}

/**
 * Is the user upgrading to the `latest` version of Storybook?
 * Let's try to pull along some of the storybook related dependencies to `latest` as well!
 *
 * We communicate clearly that this migration is a helping hand, but not a complete solution.
 * The user should still manually check for other dependencies that might be incompatible.
 *
 * see: https://github.com/storybookjs/storybook/issues/25731#issuecomment-1977346398
 */
export const upgradeStorybookRelatedDependencies = {
  id: 'upgradeStorybookRelatedDependencies',
  versionRange: ['*.*.*', '*.*.*'],
  promptType: 'auto',
  promptDefaultValue: false,

  async check({ packageManager, storybookVersion }) {
    const analyzedPackages = await getIncompatibleStorybookPackages({
      currentStorybookVersion: storybookVersion,
      packageManager,
      skipErrors: true,
    });

    const allDependencies = (await packageManager.getAllDependencies()) as Record<string, string>;
    const storybookDependencies = Object.keys(allDependencies)
      .filter((dep) => dep.includes('storybook'))
      .filter(isCorePackage);
    const incompatibleDependencies = analyzedPackages
      .filter((pkg) => pkg.hasIncompatibleDependencies)
      .map((pkg) => pkg.packageName);

    const uniquePackages = Array.from(
      new Set([...storybookDependencies, ...incompatibleDependencies])
    ).map((packageName) => [packageName, allDependencies[packageName]]) as [string, string][];

    const packageVersions = await getLatestVersions(packageManager, uniquePackages);
    const categorizedPackages = categorizePackages(packageVersions, allDependencies);

    return categorizedPackages.upgradable.length > 0 ? categorizedPackages : null;
  },

  prompt({ upgradable: list }) {
    return dedent`
      You're upgrading to the latest version of Storybook. We recommend upgrading the following packages:
      ${list
        .map(({ packageName, afterVersion, beforeVersion }) => {
          return `- ${cyan(packageName)}: ${cyan(beforeVersion)} => ${cyan(afterVersion)}`;
        })
        .join('\n')}

      After upgrading, we will run the dedupe command, which could possibly have effects on dependencies that are not Storybook related.
      see: https://docs.npmjs.com/cli/commands/npm-dedupe

      Do you want to proceed (upgrade the detected packages)?
    `;
  },

  async run({ result: { upgradable, problematicPackages }, packageManager, dryRun }) {
    if (dryRun) {
      console.log(dedent`
        We would have upgrade the following:
        ${upgradable
          .map(
            ({ packageName, afterVersion, beforeVersion }) =>
              `${packageName}: ${beforeVersion} => ${afterVersion}`
          )
          .join('\n')}
      `);
      return;
    }

    if (upgradable.length > 0) {
      const packageJson = await packageManager.readPackageJson();

      upgradable.forEach((item) => {
        if (!item) {
          return;
        }

        const { packageName, afterVersion: version } = item;
        const prefixed = `^${version}`;

        if (packageJson.dependencies?.[packageName]) {
          packageJson.dependencies[packageName] = prefixed;
        }
        if (packageJson.devDependencies?.[packageName]) {
          packageJson.devDependencies[packageName] = prefixed;
        }
        if (packageJson.peerDependencies?.[packageName]) {
          packageJson.peerDependencies[packageName] = prefixed;
        }
      });

      await packageManager.writePackageJson(packageJson);
      await packageManager.installDependencies();

      await packageManager
        .executeCommand({ command: 'dedupe', args: [], stdio: 'ignore' })
        .catch(() => {});

      console.log();
      console.log(dedent`
        We upgraded ${yellow(upgradable.length)} packages:
        ${upgradable
          .map(({ packageName, afterVersion, beforeVersion }) => {
            return `- ${cyan(packageName)}: ${cyan(beforeVersion)} => ${cyan(afterVersion)}`;
          })
          .join('\n')}
        `);
    }

    if (problematicPackages.length) {
      console.log();
      console.log(dedent`
        The following packages could not be upgraded,
        likely because there's no update available compatible with the latest version of Storybook:
        ${problematicPackages.map(({ packageName }) => `- ${cyan(packageName)}`).join('\n')}

        We suggest your reach out to the authors of these packages to get them updated.
        But before reporting, please check if there is already an open issue or PR for this.
        `);
    }
    console.log();
  },
} satisfies Fix<Options>;

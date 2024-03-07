import { dedent } from 'ts-dedent';
import type { Fix } from '../types';
import { cyan, underline, yellow } from 'chalk';
import { getIncompatibleStorybookPackages } from '../../doctor/getIncompatibleStorybookPackages';
import { valid, coerce } from 'semver';

interface Options {
  upgradable: { packageName: string; version: string }[];
  problematicPackages: { packageName: string; version: string }[];
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
    const packageJson = await packageManager.readPackageJson();
    const analyzed = await getIncompatibleStorybookPackages({
      currentStorybookVersion: storybookVersion,
      packageManager,
      skipErrors: true,
    });

    const all = await packageManager.getAllDependencies();

    const associated = Object.keys(all).filter((dep) => dep.includes('storybook'));
    const detected = analyzed
      .filter((m) => m.hasIncompatibleDependencies)
      .map((m) => m.packageName);

    const list = await Promise.all(
      Array.from(new Set([...associated, ...detected])).map(async (packageName) => {
        return {
          packageName,
          version: await packageManager.latestVersion(packageName).catch(() => null),
        };
      })
    );

    const data = list.reduce<Options>(
      (acc, k) => {
        if (k.version !== null) {
          const { packageName, version } = k;
          const upgradable = !(
            !valid(k.version) ||
            k.version === coerce(packageJson?.dependencies?.[k.packageName])?.toString() ||
            k.version === coerce(packageJson?.devDependencies?.[k.packageName])?.toString() ||
            k.version === coerce(packageJson?.peerDependencies?.[k.packageName])?.toString()
          );

          if (upgradable) {
            acc.upgradable.push({ packageName, version });
          } else {
            acc.problematicPackages.push({ packageName, version });
          }
        }

        return acc;
      },
      { upgradable: [], problematicPackages: [] }
    );

    if (data.upgradable.length > 0) {
      return data;
    }

    return null;
  },

  prompt({ upgradable: list }) {
    return dedent`
      You're upgrading to the latest version of Storybook. We recommend upgrading the following packages:
      ${list
        .map(({ packageName, version }) => `- ${cyan(packageName)}@${cyan(version)}`)
        .join('\n')}

      We detected those packages are incompatible with the latest version of Storybook.
      ${underline(
        `The list might be incomplete, so it's advised to upgrade dependencies manually, but this automigration can help you get started.`
      )}

      After upgrading, we will run the dedupe command, which could possibly have effects on dependencies that are not storybook related.
      see: https://docs.npmjs.com/cli/commands/npm-dedupe

      Do you want to proceed (upgrade the detected packages)?
    `;
  },

  async run({ result: { upgradable, problematicPackages }, packageManager, dryRun }) {
    if (dryRun) {
      console.log(dedent`
        We would have upgrade the following:
        ${upgradable.map(({ packageName, version }) => `${packageName}@${version}`).join('\n')}
      `);
      return;
    }

    if (upgradable.length > 0) {
      const packageJson = await packageManager.readPackageJson();

      upgradable.forEach((item) => {
        if (!item) {
          return;
        }

        const { packageName, version } = item;
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
          .map(({ packageName, version }) => `- ${cyan(packageName)}@${cyan(version)}`)
          .join('\n')}
        `);
    }

    if (problematicPackages.length) {
      console.log();
      console.log(dedent`
        The following packages, could not be upgraded,
        likely because there's no update available compatible with the latest version of Storybook:
        ${problematicPackages.map(({ packageName }) => `- ${cyan(packageName)}`).join('\n')}

        We suggest your reach out to the authors of these packages to get them updated.
        But before reporting, please check if there is already an open issue or PR for this.
        `);
    }
    console.log();
  },
} satisfies Fix<Options>;

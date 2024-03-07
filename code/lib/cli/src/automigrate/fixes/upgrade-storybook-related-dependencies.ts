import { dedent } from 'ts-dedent';
import type { Fix } from '../types';
import { underline } from 'chalk';
import { getIncompatibleStorybookPackages } from '../../doctor/getIncompatibleStorybookPackages';

interface Options {
  list: { packageName: string; version: string }[];
}

type ExcludesFalse = <T>(x: T | undefined) => x is T;

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

  versionRange: ['<8', '>=8'],

  async check({ packageManager, storybookVersion }) {
    const out = await getIncompatibleStorybookPackages({
      currentStorybookVersion: storybookVersion,
      packageManager,
      skipErrors: true,
    });

    const list = await Promise.all(
      out.map(async ({ packageName, hasIncompatibleDependencies }) => {
        if (!hasIncompatibleDependencies) {
          return;
        }

        return {
          packageName,
          version: await packageManager.latestVersion(packageName),
        };
      })
    );

    const filtered = list.filter(Boolean as any as ExcludesFalse);
    return { list: filtered };
  },

  promptType: 'auto-no',

  prompt({ list }) {
    return dedent`
      You're upgrading to the latest version of Storybook. We recommend upgrading the following packages:
      ${list.map(({ packageName, version }) => `${packageName}@${version}`).join(', ')}

      We detected those packages are incompatible with the latest version of Storybook.
      ${underline(
        `The list might be incomplete, so it's advised to upgrade dependencies manually, but this automigration can help you get started.`
      )}

      After upgrading, we will run the dedupe command, which could possibly have effects on dependencies that are not storybook related.
      see: https://docs.npmjs.com/cli/commands/npm-dedupe

      Do you want to proceed (upgrade the detected packages)?
    `;
  },

  async run({ result: { list }, packageManager, dryRun, mainConfigPath }) {
    if (dryRun) {
      console.log(dedent`
        would have upgrade the following:
        ${list.map(({ packageName, version }) => `${packageName}@${version}`).join('\n')}
      `);
      return;
    }

    const packageJson = await packageManager.readPackageJson();

    // mutate the packageJson data
    list.forEach((item) => {
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

    await packageManager.getRunCommand('dedupe');
  },
} satisfies Fix<Options>;

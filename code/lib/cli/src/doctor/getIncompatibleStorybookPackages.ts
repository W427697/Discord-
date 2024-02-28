/* eslint-disable local-rules/no-uncategorized-errors */
import chalk from 'chalk';
import semver from 'semver';
import readPkgUp from 'read-pkg-up';
import type { JsPackageManager } from '@storybook/core-common';
import { JsPackageManagerFactory, versions as storybookCorePackages } from '@storybook/core-common';

type AnalysedPackage = {
  packageName: string;
  packageVersion?: string;
  homepage?: string;
  hasIncompatibleDependencies?: boolean;
  latestVersionOfPackage?: string;
  availableUpdate?: boolean;
};

export const getIncompatibleStorybookPackages = async ({
  currentStorybookVersion,
  packageManager = JsPackageManagerFactory.getPackageManager(),
  skipUpgradeCheck = false,
  skipErrors = false,
}: {
  currentStorybookVersion: string;
  packageManager?: JsPackageManager;
  skipUpgradeCheck?: boolean;
  skipErrors?: boolean;
}): Promise<AnalysedPackage[]> => {
  const allDeps = await packageManager.getAllDependencies();
  const storybookLikeDeps = Object.keys(allDeps).filter((dep) => dep.includes('storybook'));

  if (storybookLikeDeps.length === 0) {
    throw new Error('No storybook dependencies found in the package.json');
  }

  const isPackageIncompatible = (installedVersion: string) => {
    const dependencyMajor = semver.coerce(installedVersion)!.major;
    const storybookMajor = semver.coerce(currentStorybookVersion)!.major;
    return dependencyMajor !== storybookMajor;
  };

  const checkCompatibility = async (dependency: string): Promise<AnalysedPackage> => {
    try {
      const resolvedPath = require.resolve(dependency);
      const result = await readPkgUp({ cwd: resolvedPath });

      if (!result?.packageJson) {
        throw new Error(`No package.json found for ${dependency}`);
      }

      const {
        packageJson: { version: versionSpecifier, name, dependencies, peerDependencies, homepage },
      } = result;
      const coercedVersion = new semver.SemVer(versionSpecifier);
      const packageVersion = coercedVersion.version;

      const hasIncompatibleDependencies = !!Object.entries({
        ...dependencies,
        ...peerDependencies,
      })
        .filter(([dep]) => Object.keys(storybookCorePackages).includes(dep))
        .find(([, version]) => {
          // prevent issues with "tag" based versions e.g. "latest" or "next" instead of actual numbers
          return version && semver.validRange(version) && isPackageIncompatible(version);
        });

      let latestVersionOfPackage;

      if (!skipUpgradeCheck) {
        try {
          const isStorybookPreRelease = currentStorybookVersion.includes('-');
          // if the user is on a pre-release, we try to get the existing prereleases of all packages
          if (isStorybookPreRelease) {
            // this is mostly a guess that makes it work for external addons which use the next/latest release strategy
            const constraint = currentStorybookVersion.includes('-')
              ? `^${coercedVersion.major + 1}.0.0-alpha.0`
              : `^${coercedVersion.major + 1}.0.0`;

            latestVersionOfPackage = await packageManager.latestVersion(name, constraint);
          } else {
            latestVersionOfPackage = await packageManager.latestVersion(name);
          }
        } catch (err) {
          // things might not work when defining the prerelease constraint, so we fall back to "latest"
          latestVersionOfPackage = await packageManager.latestVersion(name);
        }
      }

      return {
        packageName: name,
        packageVersion,
        homepage,
        hasIncompatibleDependencies,
        latestVersionOfPackage,
        availableUpdate: !!(
          latestVersionOfPackage && semver.gt(latestVersionOfPackage, packageVersion)
        ),
      };
    } catch (err) {
      // For the reviewers: When running sb doctor, this error message is only shown in the log file.
      // Do we want it? maybe not? it's currently under a flag because this is also used in storybook dev and we do not want to show errors there
      // We can choose to silently fail, but this has proven quite useful as some of our addons
      // have faulty package.json files: @storybook/addon-onboarding, @storybook/addon-coverage
      if (!skipErrors) {
        console.error(
          `Error checking compatibility for ${dependency}, please report an issue:\n`,
          err
        );
      }
      return { packageName: dependency };
    }
  };

  return Promise.all(storybookLikeDeps.map((dep) => checkCompatibility(dep)));
};

export const getIncompatiblePackagesSummary = (
  dependencyAnalysis: AnalysedPackage[],
  currentVersion: string
) => {
  const summaryMessage: string[] = [];

  const incompatiblePackages = dependencyAnalysis.filter(
    (dep) => dep.hasIncompatibleDependencies
  ) as AnalysedPackage[];

  if (incompatiblePackages.length > 0) {
    summaryMessage.push(
      `The following addons are likely incompatible with Storybook ${currentVersion}:`
    );
    incompatiblePackages.forEach(
      ({
        packageName: addonName,
        packageVersion: addonVersion,
        homepage,
        availableUpdate,
        latestVersionOfPackage,
      }) => {
        const packageDescription = `${chalk.cyan(addonName)}@${chalk.cyan(addonVersion)}`;
        const updateMessage = availableUpdate ? ` (${latestVersionOfPackage} available!)` : '';
        const packageRepo = homepage ? `\n Repo: ${chalk.yellow(homepage)}` : '';

        summaryMessage.push(`- ${packageDescription}${updateMessage}${packageRepo}`);
      }
    );

    summaryMessage.push(
      '\n',
      'Please consider updating your packages or contacting the maintainers for compatibility details.',
      'For more on Storybook 8 compatibility, see the linked Github issue:',
      chalk.yellow('https://github.com/storybookjs/storybook/issues/26031')
    );
  }

  return summaryMessage.join('\n');
};

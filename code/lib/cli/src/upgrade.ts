import { sync as spawnSync } from 'cross-spawn';
import { telemetry, getStorybookCoreVersion } from '@storybook/telemetry';
import semver, { eq, lt, prerelease } from 'semver';
import { logger } from '@storybook/node-logger';
import { withTelemetry } from '@storybook/core-server';
import { UpgradeStorybookPackagesError } from '@storybook/core-events/server-errors';

import type { PackageJsonWithMaybeDeps, PackageManagerName } from './js-package-manager';
import { getPackageDetails, JsPackageManagerFactory } from './js-package-manager';
import { coerceSemver, commandLog } from './helpers';
import { automigrate } from './automigrate';
import { isCorePackage } from './utils';
import versions from './versions';

type Package = {
  package: string;
  version: string;
};

const versionRegex = /(@storybook\/[^@]+)@(\S+)/;
export const getStorybookVersion = (line: string) => {
  if (line.startsWith('npm ')) return null;
  const match = versionRegex.exec(line);
  if (!match || !semver.clean(match[2])) return null;
  return {
    package: match[1],
    version: match[2],
  };
};

const deprecatedPackages = [
  {
    minVersion: '6.0.0-alpha.0',
    url: 'https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#60-deprecations',
    deprecations: [
      '@storybook/addon-notes',
      '@storybook/addon-info',
      '@storybook/addon-contexts',
      '@storybook/addon-options',
      '@storybook/addon-centered',
    ],
  },
];

const formatPackage = (pkg: Package) => `${pkg.package}@${pkg.version}`;

const warnPackages = (pkgs: Package[]) =>
  pkgs.forEach((pkg) => logger.warn(`- ${formatPackage(pkg)}`));

export const checkVersionConsistency = () => {
  const lines = spawnSync('npm', ['ls'], { stdio: 'pipe', shell: true })
    .output.toString()
    .split('\n');
  const storybookPackages = lines
    .map(getStorybookVersion)
    .filter((item): item is NonNullable<typeof item> => !!item)
    .filter((pkg) => isCorePackage(pkg.package));
  if (!storybookPackages.length) {
    logger.warn('No storybook core packages found.');
    logger.warn(`'npm ls | grep storybook' can show if multiple versions are installed.`);
    return;
  }
  storybookPackages.sort((a, b) => semver.rcompare(a.version, b.version));
  const latestVersion = storybookPackages[0].version;
  const outdated = storybookPackages.filter((pkg) => pkg.version !== latestVersion);
  if (outdated.length > 0) {
    logger.warn(
      `Found ${outdated.length} outdated packages (relative to '${formatPackage(
        storybookPackages[0]
      )}')`
    );
    logger.warn('Please make sure your packages are updated to ensure a consistent experience.');
    warnPackages(outdated);
  }

  deprecatedPackages.forEach(({ minVersion, url, deprecations }) => {
    if (semver.gte(latestVersion, minVersion)) {
      const deprecated = storybookPackages.filter((pkg) => deprecations.includes(pkg.package));
      if (deprecated.length > 0) {
        logger.warn(`Found ${deprecated.length} deprecated packages since ${minVersion}`);
        logger.warn(`See ${url}`);
        warnPackages(deprecated);
      }
    }
  });
};

type ExtraFlags = Record<string, string[]>;
const EXTRA_FLAGS: ExtraFlags = {
  'react-scripts@<5': ['--reject', '/preset-create-react-app/'],
};

export const addExtraFlags = (
  extraFlags: ExtraFlags,
  flags: string[],
  { dependencies, devDependencies }: PackageJsonWithMaybeDeps
) => {
  return Object.entries(extraFlags).reduce(
    (acc, entry) => {
      const [pattern, extra] = entry;
      const [pkg, specifier] = getPackageDetails(pattern);
      const pkgVersion = dependencies?.[pkg] || devDependencies?.[pkg];

      if (pkgVersion && specifier && semver.satisfies(coerceSemver(pkgVersion), specifier)) {
        return [...acc, ...extra];
      }

      return acc;
    },
    [...flags]
  );
};

export const addNxPackagesToReject = (flags: string[]) => {
  const newFlags = [...flags];
  const index = flags.indexOf('--reject');
  if (index > -1) {
    // Try to understand if it's in the format of a regex pattern
    if (newFlags[index + 1].endsWith('/') && newFlags[index + 1].startsWith('/')) {
      // Remove last and first slash so that I can add the parentheses
      newFlags[index + 1] = newFlags[index + 1].substring(1, newFlags[index + 1].length - 1);
      newFlags[index + 1] = `"/(${newFlags[index + 1]}|@nrwl/storybook|@nx/storybook)/"`;
    } else {
      // Adding the two packages as comma-separated values
      // If the existing rejects are in regex format, they will be ignored.
      // Maybe we need to find a more robust way to treat rejects?
      newFlags[index + 1] = `${newFlags[index + 1]},@nrwl/storybook,@nx/storybook`;
    }
  } else {
    newFlags.push('--reject');
    newFlags.push('@nrwl/storybook,@nx/storybook');
  }
  return newFlags;
};

export interface UpgradeOptions {
  skipCheck: boolean;
  packageManager: PackageManagerName;
  dryRun: boolean;
  yes: boolean;
  disableTelemetry: boolean;
  configDir?: string;
}

export const doUpgrade = async ({
  skipCheck,
  packageManager: pkgMgr,
  dryRun,
  configDir,
  yes,
  ...options
}: UpgradeOptions) => {
  const packageManager = JsPackageManagerFactory.getPackageManager({ force: pkgMgr });

  commandLog(`Checking for latest versions of '@storybook/*' packages\n`);

  const currentVersion = versions['@storybook/cli'];
  const beforeVersion = await getStorybookCoreVersion();

  if (lt(currentVersion, beforeVersion)) {
    // TODO: use correct error type and improve message
    throw new Error('you are downgrading Storybook, this is not supported');
  }
  if (eq(currentVersion, beforeVersion)) {
    // TODO: use correct error type and improve message
    throw new Error(
      'you are upgrading to the same version that you already have. run automigrate instead.'
    );
  }

  const latestVersion = await packageManager.latestVersion('@storybook/cli');
  const isOutdated = lt(currentVersion, latestVersion);
  const isPrerelease = prerelease(currentVersion) !== null;

  if (isOutdated) {
    // TODO: warn if not upgrading to the latest version
    console.warn('You are not upgrading to the latest version of Storybook, is this on purpose?');
  }
  const packageJson = await packageManager.retrievePackageJson();

  const toUpgradedDependencies = (dependencies: typeof packageJson['dependencies']) => {
    const monorepoDependencies = Object.keys(dependencies || {}).filter(
      (dependency) => dependency in versions
    ) as Array<keyof typeof versions>;
    return monorepoDependencies.map(
      (dependency) =>
        `${dependency}@${!isOutdated || isPrerelease ? '^' : ''}${versions[dependency]}`
    );
  };

  const upgradedDependencies = toUpgradedDependencies(packageJson.dependencies);
  const upgradedDevDependencies = toUpgradedDependencies(packageJson.devDependencies);

  if (!dryRun) {
    commandLog(`Installing upgrades`);
    if (upgradedDependencies.length > 0) {
      await packageManager.addDependencies(
        { installAsDevDependencies: false, skipInstall: true, packageJson },
        upgradedDependencies
      );
    }
    if (upgradedDevDependencies.length > 0) {
      await packageManager.addDependencies(
        { installAsDevDependencies: true, skipInstall: true, packageJson },
        upgradedDevDependencies
      );
    }
    await packageManager.installDependencies();
  }

  let automigrationResults;
  if (!skipCheck) {
    checkVersionConsistency();
    automigrationResults = await automigrate({ dryRun, yes, packageManager: pkgMgr, configDir });
  }
  if (!options.disableTelemetry) {
    const afterVersion = await getStorybookCoreVersion();
    const { preCheckFailure, fixResults } = automigrationResults || {};
    const automigrationTelemetry = {
      automigrationResults: preCheckFailure ? null : fixResults,
      automigrationPreCheckFailure: preCheckFailure || null,
    };
    telemetry('upgrade', {
      prerelease,
      beforeVersion,
      afterVersion,
      ...automigrationTelemetry,
    });
  }
};

export async function upgrade(options: UpgradeOptions): Promise<void> {
  await withTelemetry('upgrade', { cliOptions: options }, () => doUpgrade(options));
}

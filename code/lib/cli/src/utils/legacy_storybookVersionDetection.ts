/* eslint-disable @typescript-eslint/naming-convention */
import { sync as spawnSync } from 'cross-spawn';
import semver from 'semver';

const legacy_versionRegex = /(@storybook\/[^@]+)@(\S+)/;

const legacy_excludeList = [
  '@storybook/linter-config',
  '@storybook/design-system',
  '@storybook/ember-cli-storybook',
  '@storybook/semver',
  '@storybook/eslint-config-storybook',
  '@storybook/bench',
  '@storybook/addon-bench',
  '@storybook/addon-console',
  '@storybook/csf',
  '@storybook/storybook-deployer',
  '@storybook/addon-postcss',
  '@storybook/react-docgen-typescript-plugin',
  '@storybook/babel-plugin-require-context-hook',
  '@storybook/builder-vite',
  '@storybook/mdx1-csf',
  '@storybook/mdx2-csf',
  '@storybook/expect',
  '@storybook/jest',
  '@storybook/test-runner',
  '@storybook/testing-library',
];
const legacy_isCorePackage = (pkg: string) =>
  pkg.startsWith('@storybook/') &&
  !pkg.startsWith('@storybook/preset-') &&
  !legacy_excludeList.includes(pkg);

/**
 * @deprecated This function has been deprecated. This is solely to support upgrading from SB6 (and possible SB7)
 * I took this code from https://github.com/storybookjs/storybook/blob/v6.5.16/lib/cli/src/upgrade.ts#L29-L109
 */
export const legacy_getStorybookVersion = (): string | undefined => {
  const lines = spawnSync('npm', ['ls'], { stdio: 'pipe' }).output.toString().split('\n');
  const result = lines
    .map((line) => {
      if (line.startsWith('npm ')) return null;
      const match = legacy_versionRegex.exec(line);
      if (!match || !semver.clean(match[2])) return null;
      return {
        package: match[1],
        version: match[2],
      };
    })
    .filter(Boolean)
    .filter((pkg) => legacy_isCorePackage(pkg!.package))
    .sort((a, b) => semver.rcompare(a!.version, b!.version));

  if (result.length === 0) {
    return undefined;
  }

  return result[0]?.version;
};

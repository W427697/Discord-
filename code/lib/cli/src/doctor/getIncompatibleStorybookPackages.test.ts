import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getIncompatibleStorybookPackages,
  getIncompatiblePackagesSummary,
} from './getIncompatibleStorybookPackages';
import pkgUp from 'read-pkg-up';
import type { JsPackageManager } from '@storybook/core-common';

vi.mock('chalk', () => {
  return {
    default: {
      yellow: (str: string) => str,
      cyan: (str: string) => str,
    },
  };
});

vi.mock('read-pkg-up', () => ({
  default: vi.fn(),
}));

const packageManagerMock = {
  getAllDependencies: () =>
    Promise.resolve({
      '@storybook/addon-essentials': '7.0.0',
    }),
  latestVersion: vi.fn(() => Promise.resolve('8.0.0')),
} as Partial<JsPackageManager>;

describe('getIncompatibleStorybookPackages', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns an array of incompatible packages', async () => {
    vi.mocked(pkgUp).mockResolvedValueOnce({
      packageJson: {
        name: '@storybook/addon-essentials',
        version: '7.0.0',
        dependencies: {
          '@storybook/core-common': '7.0.0',
        },
      },
      path: '',
    });

    vi.mocked(packageManagerMock.latestVersion)?.mockResolvedValueOnce('8.0.0');

    const result = await getIncompatibleStorybookPackages({
      currentStorybookVersion: '8.0.0',
      packageManager: packageManagerMock as JsPackageManager,
    });

    expect(packageManagerMock.latestVersion).toHaveBeenCalled();
    expect(result).toEqual([
      {
        packageName: '@storybook/addon-essentials',
        packageVersion: '7.0.0',
        hasIncompatibleDependencies: true,
        homepage: undefined,
        availableUpdate: true,
        latestVersionOfPackage: '8.0.0',
      },
    ]);
  });

  it('returns an array of incompatible packages without upgrade check', async () => {
    vi.mocked(pkgUp).mockResolvedValueOnce({
      packageJson: {
        name: '@storybook/addon-essentials',
        version: '7.0.0',
        dependencies: {
          '@storybook/core-common': '7.0.0',
        },
      },
      path: '',
    });

    const result = await getIncompatibleStorybookPackages({
      currentStorybookVersion: '8.0.0',
      packageManager: packageManagerMock as JsPackageManager,
      skipUpgradeCheck: true,
    });

    expect(packageManagerMock.latestVersion).not.toHaveBeenCalled();

    expect(result).toEqual([
      {
        packageName: '@storybook/addon-essentials',
        packageVersion: '7.0.0',
        hasIncompatibleDependencies: true,
        homepage: undefined,
        availableUpdate: false,
        latestVersionOfPackage: undefined,
      },
    ]);
  });
});

describe('getIncompatiblePackagesSummary', () => {
  it('generates a summary message for incompatible packages', () => {
    const analysedPackages = [
      {
        packageName: 'storybook-react',
        packageVersion: '1.0.0',
        hasIncompatibleDependencies: true,
        latestVersionOfPackage: '2.0.0',
        availableUpdate: true,
      },
    ];
    const summary = getIncompatiblePackagesSummary(analysedPackages, '7.0.0');
    expect(summary).toMatchInlineSnapshot(`
      "The following addons are likely incompatible with Storybook 7.0.0:
      - storybook-react@1.0.0 (2.0.0 available!)


      Please consider updating your packages or contacting the maintainers for compatibility details.
      For more on Storybook 8 compatibility, see the linked Github issue:
      https://github.com/storybookjs/storybook/issues/26031"
    `);
  });
});

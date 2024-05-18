import { describe, it, expect, vi } from 'vitest';
import * as sbcc from '@storybook/core/dist/common';
import {
  UpgradeStorybookToLowerVersionError,
  UpgradeStorybookToSameVersionError,
} from '@storybook/core/dist/server-errors';
import { doUpgrade, getStorybookVersion } from './upgrade';

const findInstallationsMock = vi.fn<string[], Promise<sbcc.InstallationMetadata | undefined>>();

vi.mock('@storybook/core/dist/telemetry');
vi.mock('@storybook/core/dist/common', async (importOriginal) => {
  const originalModule = (await importOriginal()) as typeof sbcc;
  return {
    ...originalModule,
    JsPackageManagerFactory: {
      getPackageManager: () => ({
        findInstallations: findInstallationsMock,
        getAllDependencies: async () => ({ storybook: '8.0.0' }),
      }),
    },
    versions: Object.keys(originalModule.versions).reduce(
      (acc, key) => {
        acc[key] = '8.0.0';
        return acc;
      },
      {} as Record<string, string>
    ),
  };
});

describe.each([
  ['│ │ │ ├── @babel/code-frame@7.10.3 deduped', null],
  [
    '│ ├── "@storybook/core/dist/theming@6.0.0-beta.37 extraneous',
    { package: '@storybook/core/dist/theming', version: '6.0.0-beta.37' },
  ],
  [
    '├─┬ @storybook/preset-create-react-app@3.1.2',
    { package: '@storybook/preset-create-react-app', version: '3.1.2' },
  ],
  ['│ ├─┬ @storybook/node-logger@5.3.19', { package: '@storybook/node-logger', version: '5.3.19' }],
  [
    'npm ERR! peer dep missing: @storybook/react@>=5.2, required by @storybook/preset-create-react-app@3.1.2',
    null,
  ],
])('getStorybookVersion', (input, output) => {
  it(`${input}`, () => {
    expect(getStorybookVersion(input)).toEqual(output);
  });
});

describe('Upgrade errors', () => {
  it('should throw an error when upgrading to a lower version number', async () => {
    findInstallationsMock.mockResolvedValue({
      dependencies: {
        '@storybook/cli': [
          {
            version: '8.1.0',
          },
        ],
      },
      duplicatedDependencies: {},
      infoCommand: '',
      dedupeCommand: '',
    });

    await expect(doUpgrade({} as any)).rejects.toThrowError(UpgradeStorybookToLowerVersionError);
    expect(findInstallationsMock).toHaveBeenCalledWith(Object.keys(sbcc.versions));
  });
  it('should throw an error when upgrading to the same version number', async () => {
    findInstallationsMock.mockResolvedValue({
      dependencies: {
        '@storybook/cli': [
          {
            version: '8.0.0',
          },
        ],
      },
      duplicatedDependencies: {},
      infoCommand: '',
      dedupeCommand: '',
    });

    await expect(doUpgrade({} as any)).rejects.toThrowError(UpgradeStorybookToSameVersionError);
    expect(findInstallationsMock).toHaveBeenCalledWith(Object.keys(sbcc.versions));
  });
});

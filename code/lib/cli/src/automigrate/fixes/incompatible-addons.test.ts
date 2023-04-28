/// <reference types="@types/jest" />;

import type { StorybookConfig } from '@junk-temporary-prototypes/types';
import type { PackageJson } from '../../js-package-manager';
import { makePackageManager, mockStorybookData } from '../helpers/testing-helpers';
import { incompatibleAddons } from './incompatible-addons';
import * as packageVersions from '../helpers/getActualPackageVersions';

jest.mock('../helpers/getActualPackageVersions');

const check = async ({
  packageJson,
  main: mainConfig = {},
  storybookVersion = '7.0.0',
}: {
  packageJson: PackageJson;
  main?: Partial<StorybookConfig> & Record<string, unknown>;
  storybookVersion?: string;
}) => {
  mockStorybookData({ mainConfig, storybookVersion });

  return incompatibleAddons.check({
    packageManager: makePackageManager(packageJson),
    configDir: '',
  });
};

describe('incompatible-addons fix', () => {
  afterEach(jest.restoreAllMocks);

  it('should show incompatible addons', async () => {
    jest.spyOn(packageVersions, 'getActualPackageVersions').mockReturnValueOnce(
      Promise.resolve([
        {
          name: '@junk-temporary-prototypes/addon-essentials',
          version: '7.0.0',
        },
        {
          name: '@junk-temporary-prototypes/addon-info',
          version: '5.3.21',
        },
      ])
    );

    const packageJson = {
      dependencies: {
        '@junk-temporary-prototypes/addon-essentials': '^7.0.0',
        '@junk-temporary-prototypes/addon-info': '^6.0.0',
      },
    };
    await expect(
      check({ packageJson, main: { addons: ['@junk-temporary-prototypes/essentials', '@junk-temporary-prototypes/addon-info'] } })
    ).resolves.toEqual({
      incompatibleAddonList: [
        {
          name: '@junk-temporary-prototypes/addon-info',
          version: '5.3.21',
        },
      ],
    });
  });

  it('no-op when there are no incompatible addons', async () => {
    jest.spyOn(packageVersions, 'getActualPackageVersions').mockReturnValueOnce(
      Promise.resolve([
        {
          name: '@junk-temporary-prototypes/addon-essentials',
          version: '7.0.0',
        },
      ])
    );

    const packageJson = {
      dependencies: { '@junk-temporary-prototypes/addon-essentials': '^7.0.0' },
    };
    await expect(
      check({ packageJson, main: { addons: ['@junk-temporary-prototypes/essentials'] } })
    ).resolves.toBeNull();
  });
});

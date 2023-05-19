/// <reference types="@types/jest" />;

import type { StorybookConfig } from '@storybook/types';
import { incompatibleAddons } from './incompatible-addons';
import * as packageVersions from '../helpers/getActualPackageVersions';
import type { JsPackageManager } from '../../js-package-manager';

jest.mock('../helpers/getActualPackageVersions');

const check = async ({
  packageManager,
  main: mainConfig = {},
  storybookVersion = '7.0.0',
}: {
  packageManager: Partial<JsPackageManager>;
  main?: Partial<StorybookConfig> & Record<string, unknown>;
  storybookVersion?: string;
}) => {
  return incompatibleAddons.check({
    packageManager: packageManager as any,
    configDir: '',
    mainConfig: mainConfig as any,
    storybookVersion,
  });
};

describe('incompatible-addons fix', () => {
  afterEach(jest.restoreAllMocks);

  it('should show incompatible addons', async () => {
    jest.spyOn(packageVersions, 'getActualPackageVersions').mockReturnValueOnce(
      Promise.resolve([
        {
          name: '@storybook/addon-essentials',
          version: '7.0.0',
        },
        {
          name: '@storybook/addon-info',
          version: '5.3.21',
        },
      ])
    );

    await expect(
      check({
        packageManager: {},
        main: { addons: ['@storybook/essentials', '@storybook/addon-info'] },
      })
    ).resolves.toEqual({
      incompatibleAddonList: [
        {
          name: '@storybook/addon-info',
          version: '5.3.21',
        },
      ],
    });
  });

  it('no-op when there are no incompatible addons', async () => {
    jest.spyOn(packageVersions, 'getActualPackageVersions').mockReturnValueOnce(
      Promise.resolve([
        {
          name: '@storybook/addon-essentials',
          version: '7.0.0',
        },
      ])
    );

    await expect(
      check({ packageManager: {}, main: { addons: ['@storybook/essentials'] } })
    ).resolves.toBeNull();
  });
});

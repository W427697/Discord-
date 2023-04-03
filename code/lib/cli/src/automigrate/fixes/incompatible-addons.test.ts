/// <reference types="@types/jest" />;

import type { StorybookConfig } from '@storybook/types';
import type { PackageJson } from '../../js-package-manager';
import { makePackageManager, mockStorybookData } from '../helpers/testing-helpers';
import { incompatibleAddons } from './incompatible-addons';

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

  it('no-op when there are known addons', async () => {
    const packageJson = {
      dependencies: { '@storybook/addon-essentials': '^7.0.0' },
    };
    await expect(
      check({ packageJson, main: { addons: ['@storybook/essentials'] } })
    ).resolves.toBeNull();
  });

  it('should show incompatible addons', async () => {
    const packageJson = {
      dependencies: {
        '@storybook/addon-essentials': '^7.0.0',
        '@storybook/addon-info': '^6.0.0',
      },
    };
    await expect(
      check({ packageJson, main: { addons: ['@storybook/essentials', '@storybook/addon-info'] } })
    ).resolves.toEqual({
      incompatibleAddonList: ['@storybook/addon-info'],
    });
  });
});

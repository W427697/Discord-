import type { StorybookConfig } from '@storybook/types';
import type { PackageJson } from '../../js-package-manager';
import { makePackageManager, mockStorybookData } from '../helpers/testing-helpers';
import { angularExecutors } from './angular-executors';

const checkAngularExecutors = async ({
  packageJson,
  main: mainConfig = {},
  storybookVersion = '7.0.0',
}: {
  packageJson: PackageJson;
  main?: Partial<StorybookConfig> & Record<string, unknown>;
  storybookVersion?: string;
}) => {
  mockStorybookData({ mainConfig, storybookVersion });

  // mock file system (look at eslint plugin test)

  return angularExecutors.check({
    packageManager: makePackageManager(packageJson),
  });
};

describe('angular12 fix', () => {
  afterEach(jest.restoreAllMocks);

  describe('should no op for non-angular projects', () => {
    const packageJson = {
      dependencies: { '@storybook/angular': '^7.0.0-alpha.0', '@angular/core': '^12.0.0' },
    };
    it('should no-op', async () => {
      await expect(
        checkAngularExecutors({
          packageJson,
        })
      ).resolves.toBeFalsy();
    });
  });
});

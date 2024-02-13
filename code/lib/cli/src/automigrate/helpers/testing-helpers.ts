import { vi } from 'vitest';
import type { JsPackageManager, PackageJson } from '@storybook/core/dist/modules/core-common/index';

vi.mock('./mainConfigFile', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./mainConfigFile')>()),
  getStorybookData: vi.fn(),
}));

vi.mock('@storybook/core/dist/modules/core-common/index', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@storybook/core/dist/modules/core-common/index')>()),
  loadMainConfig: vi.fn(),
}));

export const makePackageManager = (packageJson: PackageJson) => {
  const { dependencies = {}, devDependencies = {}, peerDependencies = {} } = packageJson;
  return {
    retrievePackageJson: async () => ({ dependencies: {}, devDependencies: {}, ...packageJson }),
    getAllDependencies: async () => ({
      ...dependencies,
      ...devDependencies,
      ...peerDependencies,
    }),
  } as JsPackageManager;
};

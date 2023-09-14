import { vi } from 'vitest';
import type { JsPackageManager, PackageJson } from '../../js-package-manager';

vi.mock('./mainConfigFile', async () => ({
  ...(await vi.importActual('./mainConfigFile')),
  getStorybookData: vi.fn(),
}));

vi.mock('@storybook/core-common', async () => ({
  ...(await vi.importActual('@storybook/core-common')),
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

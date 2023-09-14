import type { JsPackageManager, PackageJson } from '../../js-package-manager';

vi.mock('./mainConfigFile', () => ({
  ...jest.requireActual('./mainConfigFile'),
  getStorybookData: jest.fn(),
}));

vi.mock('@storybook/core-common', () => ({
  ...jest.requireActual('@storybook/core-common'),
  loadMainConfig: jest.fn(),
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

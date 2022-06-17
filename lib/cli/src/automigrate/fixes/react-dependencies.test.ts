import { JsPackageManager } from '../../js-package-manager';
import { reactDependencies } from './react-dependencies';
import * as isDependencyInstalled from '../helpers/is-dependency-installed';

const checkReactDependencies = async ({ packageJson }) => {
  const packageManager = {
    retrievePackageJson: () => ({ dependencies: {}, devDependencies: {}, ...packageJson }),
  } as JsPackageManager;
  return reactDependencies.check({ packageManager });
};

describe('react dependencies fix', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should install react if dependency is missing', async () => {
    jest
      .spyOn(isDependencyInstalled, 'isDependencyInstalled')
      .mockImplementation((dep) => dep === 'react-dom');

    const packageJson = {
      dependencies: { 'react-dom': 'x.y.z' },
    };
    await expect(
      checkReactDependencies({
        packageJson,
      })
    ).resolves.toEqual({ dependenciesToInstall: ['react'] });
  });

  it('should install both react and react-dom if dependencies are missing', async () => {
    jest.spyOn(isDependencyInstalled, 'isDependencyInstalled').mockImplementation(() => false);

    const packageJson = {
      dependencies: {},
    };
    await expect(
      checkReactDependencies({
        packageJson,
      })
    ).resolves.toEqual({ dependenciesToInstall: ['react', 'react-dom'] });
  });

  it('should no-op if react and react-dom are already installed', async () => {
    const packageJson = {
      dependencies: { react: 'x.y.z', 'react-dom': 'x.y.z' },
    };
    await expect(
      checkReactDependencies({
        packageJson,
      })
    ).resolves.toBeFalsy();
  });
});

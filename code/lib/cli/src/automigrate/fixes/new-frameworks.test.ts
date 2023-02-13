/* eslint-disable no-underscore-dangle */
import * as path from 'path';
import type { StorybookConfig } from '@storybook/types';
import * as coreCommon from '@storybook/core-common';
import type { JsPackageManager, PackageJson } from '../../js-package-manager';
import { detectRenderer } from '../helpers/detectRenderer';

import { newFrameworks } from './new-frameworks';

jest.mock('@storybook/core-common', () => ({
  ...jest.requireActual('@storybook/core-common'),
  loadMainConfig: jest.fn(),
}));

jest.mock('../helpers/detectRenderer');

// eslint-disable-next-line global-require, jest/no-mocks-import
jest.mock('fs-extra', () => require('../../../../../__mocks__/fs-extra'));

const checkNewFrameworks = async ({
  packageJson,
  main,
}: {
  packageJson: PackageJson;
  main: Partial<StorybookConfig> & Record<string, unknown>;
}) => {
  if (main) {
    jest.spyOn(coreCommon, 'loadMainConfig').mockReturnValue(Promise.resolve(main) as any);
    // eslint-disable-next-line global-require
    require('fs-extra').__setMockFiles({
      [path.join('.storybook', 'main.js')]: `
        const config = ${JSON.stringify(main)};
        export default config;
      `,
    });
  } else {
    jest
      .spyOn(coreCommon, 'loadMainConfig')
      .mockReturnValue(Promise.reject(new Error('could not find main.js!')));
  }
  const packageManager = {
    retrievePackageJson: () => ({ dependencies: {}, devDependencies: {}, ...packageJson }),
  } as JsPackageManager;
  return newFrameworks.check({ packageManager });
};

describe('new-frameworks fix', () => {
  describe('should no-op', () => {
    it('in sb < 7', async () => {
      const packageJson = { dependencies: { '@storybook/vue': '^6.2.0' } };
      await expect(
        checkNewFrameworks({
          packageJson,
          main: {},
        })
      ).resolves.toBeFalsy();
    });

    it('in sb 7 with no main', async () => {
      const packageJson = { dependencies: { '@storybook/vue': '^7.0.0' } };
      await expect(
        checkNewFrameworks({
          packageJson,
          main: undefined,
        })
      ).resolves.toBeFalsy();
    });

    it('in sb 7 with no framework field in main', async () => {
      const packageJson = { dependencies: { '@storybook/vue': '^7.0.0' } };
      (detectRenderer as jest.Mock).mockReturnValueOnce(Promise.resolve('@storybook/vue'));
      await expect(
        checkNewFrameworks({
          packageJson,
          main: {},
        })
      ).resolves.toEqual(
        expect.objectContaining({
          frameworkPackage: '@storybook/vue-webpack5',
          dependenciesToAdd: ['@storybook/vue-webpack5'],
          hasFrameworkInMainConfig: false,
        })
      );
    });

    it('in sb 7 with no builder', async () => {
      const packageJson = { dependencies: { '@storybook/vue': '^7.0.0' } };
      await expect(
        checkNewFrameworks({
          packageJson,
          main: {
            framework: '@storybook/vue',
          },
        })
      ).resolves.toEqual(
        expect.objectContaining({
          frameworkPackage: '@storybook/vue-webpack5',
          dependenciesToAdd: ['@storybook/vue-webpack5'],
          dependenciesToRemove: [],
        })
      );
    });

    it('in sb 7 with unsupported package', async () => {
      const packageJson = { dependencies: { '@storybook/riot': '^7.0.0' } };
      await expect(
        checkNewFrameworks({
          packageJson,
          main: {
            framework: '@storybook/riot',
            core: {
              builder: 'webpack5',
            },
          },
        })
      ).resolves.toBeFalsy();
    });

    it('in sb 7 with correct structure already', async () => {
      const packageJson = { dependencies: { '@storybook/angular': '^7.0.0' } };
      await expect(
        checkNewFrameworks({
          packageJson,
          main: {
            framework: '@storybook/angular',
          },
        })
      ).resolves.toBeFalsy();
    });

    it('in sb 7 with vite < 3', async () => {
      const packageJson = {
        dependencies: {
          '@storybook/react': '^7.0.0',
          '@storybook/builder-vite': 'x.y.z',
          vite: '^2.0.0',
        },
      };
      await expect(
        checkNewFrameworks({
          packageJson,
          main: {
            framework: '@storybook/react',
            core: {
              builder: '@storybook/builder-vite',
            },
          },
        })
      ).rejects.toBeTruthy();
    });

    it('should prompt when there are multiple renderer packages', async () => {
      const packageJson = {
        dependencies: {
          '@storybook/react': '^7.0.0',
          '@storybook/angular': '^7.0.0',
          '@storybook/builder-vite': 'x.y.z',
        },
      };
      // there should be a prompt, which we mock the response
      (detectRenderer as jest.Mock).mockReturnValueOnce(Promise.resolve('@storybook/react'));
      await expect(
        checkNewFrameworks({
          packageJson,
          main: {
            core: {
              builder: '@storybook/builder-vite',
            },
          },
        })
      ).resolves.toEqual(
        expect.objectContaining({
          frameworkPackage: '@storybook/react-vite',
        })
      );
      expect(detectRenderer).toHaveBeenCalled();
    });
  });

  describe('sb >= 7', () => {
    describe('new-frameworks dependency', () => {
      it('should update to @storybook/react-webpack5', async () => {
        const packageJson = {
          dependencies: {
            '@storybook/react': '^7.0.0-alpha.0',
            '@storybook/builder-webpack5': '^6.5.9',
            '@storybook/manager-webpack5': '^6.5.9',
          },
        };
        await expect(
          checkNewFrameworks({
            packageJson,
            main: {
              framework: '@storybook/react',
              core: {
                builder: {
                  name: 'webpack5',
                  options: {
                    lazyCompilation: true,
                  },
                },
              },
              reactOptions: {
                fastRefresh: true,
              },
            },
          })
        ).resolves.toEqual(
          expect.objectContaining({
            frameworkPackage: '@storybook/react-webpack5',
            dependenciesToAdd: ['@storybook/react-webpack5'],
            dependenciesToRemove: ['@storybook/builder-webpack5', '@storybook/manager-webpack5'],
            frameworkOptions: {
              fastRefresh: true,
            },
            builderInfo: {
              name: 'webpack5',
              options: {
                lazyCompilation: true,
              },
            },
          })
        );
      });

      it('should update only builders in @storybook/angular', async () => {
        const packageJson = {
          dependencies: {
            '@storybook/angular': '^7.0.0-alpha.0',
            '@storybook/builder-webpack5': '^6.5.9',
            '@storybook/manager-webpack5': '^6.5.9',
          },
        };
        await expect(
          checkNewFrameworks({
            packageJson,
            main: {
              framework: '@storybook/angular',
              core: {
                builder: {
                  name: 'webpack5',
                  options: {
                    lazyCompilation: true,
                  },
                },
              },
              angularOptions: {
                enableIvy: true,
                enableNgcc: true,
              },
            },
          })
        ).resolves.toEqual(
          expect.objectContaining({
            frameworkPackage: '@storybook/angular',
            dependenciesToAdd: [],
            dependenciesToRemove: ['@storybook/builder-webpack5', '@storybook/manager-webpack5'],
            frameworkOptions: {
              enableIvy: true,
              enableNgcc: true,
            },
            builderInfo: {
              name: 'webpack5',
              options: {
                lazyCompilation: true,
              },
            },
          })
        );
      });

      it('should update to @storybook/react-vite', async () => {
        const packageJson = {
          dependencies: {
            '@storybook/react': '^7.0.0-alpha.0',
            '@storybook/builder-vite': '^0.0.2',
            vite: '3.0.0',
          },
        };
        await expect(
          checkNewFrameworks({
            packageJson,
            main: {
              framework: '@storybook/react',
              core: {
                builder: '@storybook/builder-vite',
              },
            },
          })
        ).resolves.toEqual(
          expect.objectContaining({
            frameworkPackage: '@storybook/react-vite',
            dependenciesToAdd: ['@storybook/react-vite'],
            dependenciesToRemove: ['@storybook/builder-vite'],
          })
        );
      });

      it('should update to @storybook/preact-vite', async () => {
        const packageJson = {
          dependencies: {
            '@storybook/preact': '^7.0.0-alpha.0',
            '@storybook/builder-vite': '^0.0.2',
            vite: '3.0.0',
          },
        };
        await expect(
          checkNewFrameworks({
            packageJson,
            main: {
              framework: '@storybook/preact',
              core: {
                builder: '@storybook/builder-vite',
              },
            },
          })
        ).resolves.toEqual(
          expect.objectContaining({
            frameworkPackage: '@storybook/preact-vite',
            dependenciesToAdd: ['@storybook/preact-vite'],
            dependenciesToRemove: ['@storybook/builder-vite'],
          })
        );
      });
    });
  });
});

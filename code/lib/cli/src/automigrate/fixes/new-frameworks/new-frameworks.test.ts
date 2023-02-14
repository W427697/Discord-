/* eslint-disable no-underscore-dangle */
import * as path from 'path';
import type { StorybookConfig } from '@storybook/types';
import * as coreCommon from '@storybook/core-common';
import type { JsPackageManager, PackageJson } from '../../../js-package-manager';
import * as rendererHelpers from '../../helpers/detectRenderer';
import * as frameworkHelpers from '../../helpers/detectFramework';

import { newFrameworks } from './new-frameworks';

jest.mock('@storybook/core-common', () => ({
  ...jest.requireActual('@storybook/core-common'),
  loadMainConfig: jest.fn(),
}));

// eslint-disable-next-line global-require, jest/no-mocks-import
jest.mock('fs-extra', () => require('../../../../../../__mocks__/fs-extra'));

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
  });

  describe('should throw an error', () => {
    it('in sb 7 with no main.js', async () => {
      const packageJson = { dependencies: { '@storybook/vue': '^7.0.0' } };
      await expect(() =>
        checkNewFrameworks({
          packageJson,
          main: undefined,
        })
      ).rejects.toBeTruthy();
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
  });

  describe('sb >= 7', () => {
    describe('generic new-frameworks migration', () => {
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
            renderer: 'react',
            frameworkPackage: '@storybook/react-webpack5',
            dependenciesToAdd: ['@storybook/react-webpack5'],
            dependenciesToRemove: ['@storybook/builder-webpack5', '@storybook/manager-webpack5'],
            frameworkOptions: {
              fastRefresh: true,
            },
            builderConfig: {
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
            builderConfig: {
              name: 'webpack5',
              options: {
                lazyCompilation: true,
              },
            },
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

      it('should update correctly when there is no builder', async () => {
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

      it('in sb 7 with no framework field in main', async () => {
        const packageJson = { dependencies: { '@storybook/vue': '^7.0.0' } };
        // (detectRenderer as jest.Mock).mockReturnValueOnce(Promise.resolve('@storybook/vue'));
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

      it('should prompt when there are multiple renderer packages', async () => {
        // there should be a prompt, which we mock the response
        const detectRendererSpy = jest.spyOn(rendererHelpers, 'detectRenderer');
        detectRendererSpy.mockReturnValueOnce(Promise.resolve('@storybook/react'));
        const packageJson = {
          dependencies: {
            '@storybook/react': '^7.0.0',
            '@storybook/vue': '^7.0.0',
            '@storybook/builder-vite': 'x.y.z',
          },
        };
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
            dependenciesToRemove: ['@storybook/builder-vite'],
          })
        );
        expect(detectRendererSpy).toHaveBeenCalled();
      });

      it('should add main.js when everything is properly configured, but main.js is missing', async () => {
        const detectFrameworkSpy = jest
          .spyOn(frameworkHelpers, 'detectFramework')
          .mockReturnValueOnce(Promise.resolve('@storybook/react-vite'));
        const detectRendererSpy = jest
          .spyOn(rendererHelpers, 'detectRenderer')
          .mockReturnValueOnce(Promise.resolve('@storybook/react'));
        const packageJson = {
          dependencies: {
            '@storybook/react': '^7.0.0-alpha.0',
            '@storybook/react-vite': '^7.0.0-alpha.0',
          },
        };
        await expect(
          checkNewFrameworks({
            packageJson,
            main: {},
          })
        ).resolves.toEqual(
          expect.objectContaining({
            hasFrameworkInMainConfig: false,
            frameworkPackage: '@storybook/react-vite',
          })
        );
        expect(detectFrameworkSpy).toHaveBeenCalled();
        expect(detectRendererSpy).toHaveBeenCalled();
      });

      it('should prompt when there are multiple frameworks', async () => {
        jest
          .spyOn(frameworkHelpers, 'detectFramework')
          .mockReturnValueOnce(Promise.resolve('@storybook/react-vite'));
        jest
          .spyOn(rendererHelpers, 'detectRenderer')
          .mockReturnValueOnce(Promise.resolve('@storybook/react'));
        const packageJson = {
          dependencies: {
            '@storybook/react': '^7.0.0-alpha.0',
            '@storybook/react-vite': '^7.0.0-alpha.0',
            '@storybook/vue3': '^7.0.0-alpha.0',
            '@storybook/vue3-vite': '^7.0.0-alpha.0',
          },
        };
        await expect(
          checkNewFrameworks({
            packageJson,
            main: {},
          })
        ).resolves.toEqual(
          expect.objectContaining({
            hasFrameworkInMainConfig: false,
            frameworkPackage: '@storybook/react-vite',
          })
        );
      });
    });

    describe('nextjs migration', () => {
      it('should update from @storybook/react-webpack5 to @storybook/nextjs', async () => {
        const packageJson = {
          dependencies: {
            '@storybook/react': '^7.0.0-alpha.0',
            '@storybook/react-webpack5': '^7.0.0-alpha.0',
            next: '^12.0.0',
          },
        };
        await expect(
          checkNewFrameworks({
            packageJson,
            main: {
              framework: '@storybook/react-webpack5',
            },
          })
        ).resolves.toEqual(expect.objectContaining({}));
      });

      it('should remove legacy addons', async () => {
        const packageJson = {
          dependencies: {
            '@storybook/react': '^7.0.0-alpha.0',
            '@storybook/react-webpack5': '^7.0.0-alpha.0',
            next: '^12.0.0',
            'storybook-addon-next': '^1.0.0',
            'storybook-addon-next-router': '^1.0.0',
          },
        };
        await expect(
          checkNewFrameworks({
            packageJson,
            main: {
              framework: '@storybook/react-webpack5',
              addons: ['storybook-addon-next', 'storybook-addon-next-router'],
            },
          })
        ).resolves.toEqual(
          expect.objectContaining({
            addonsToRemove: ['storybook-addon-next', 'storybook-addon-next-router'],
          })
        );
      });

      it('should move nextjs addon options to frameworkOptions', async () => {
        const packageJson = {
          dependencies: {
            '@storybook/react': '^7.0.0-alpha.0',
            '@storybook/react-webpack5': '^7.0.0-alpha.0',
            next: '^12.0.0',
            'storybook-addon-next': '^1.0.0',
          },
        };
        await expect(
          checkNewFrameworks({
            packageJson,
            main: {
              framework: { name: '@storybook/react-webpack5', options: { fastRefresh: true } },
              addons: [
                {
                  name: 'storybook-addon-next',
                  options: {
                    nextConfigPath: '../next.config.js',
                  },
                },
              ],
            },
          })
        ).resolves.toEqual(
          expect.objectContaining({
            addonsToRemove: ['storybook-addon-next'],
            frameworkOptions: {
              fastRefresh: true,
              nextConfigPath: '../next.config.js',
            },
          })
        );
      });

      it('should migrate to @storybook/react-vite in Next.js project that uses vite builder', async () => {
        const packageJson = {
          dependencies: {
            '@storybook/react': '^7.0.0-alpha.0',
            '@storybook/builder-vite': '^7.0.0-alpha.0',
            next: '^12.0.0',
            'storybook-addon-next': '^1.0.0',
          },
        };
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
            addonsToRemove: [],
            dependenciesToAdd: ['@storybook/react-vite'],
            dependenciesToRemove: ['@storybook/builder-vite'],
            frameworkPackage: '@storybook/react-vite',
          })
        );
      });
    });
  });
});

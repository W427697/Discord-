import type { StorybookConfig } from '@junk-temporary-prototypes/types';
import * as findUp from 'find-up';
import type { PackageJson } from '../../js-package-manager';
import { makePackageManager, mockStorybookData } from '../helpers/testing-helpers';
import * as rendererHelpers from '../helpers/detectRenderer';
import { newFrameworks } from './new-frameworks';

jest.mock('find-up');
jest.mock('../helpers/detectRenderer', () => ({
  detectRenderer: jest.fn(jest.requireActual('../helpers/detectRenderer').detectRenderer),
}));

const checkNewFrameworks = async ({
  packageJson,
  main: mainConfig,
  storybookVersion = '7.0.0',
}: {
  packageJson: PackageJson;
  main: Partial<StorybookConfig> & Record<string, unknown>;
  storybookVersion?: string;
}) => {
  mockStorybookData({ mainConfig, storybookVersion });

  return newFrameworks.check({
    packageManager: makePackageManager(packageJson),
    configDir: '',
  });
};

describe('new-frameworks fix', () => {
  describe('should no-op', () => {
    it('in sb < 7', async () => {
      const packageJson = { dependencies: { '@junk-temporary-prototypes/vue': '^6.2.0' } };
      await expect(
        checkNewFrameworks({
          packageJson,
          main: {},
          storybookVersion: '6.2.0',
        })
      ).resolves.toBeFalsy();
    });

    it('in sb 7 with unsupported package', async () => {
      const packageJson = { dependencies: { '@junk-temporary-prototypes/riot': '^7.0.0' } };
      await expect(
        checkNewFrameworks({
          packageJson,
          main: {
            framework: '@junk-temporary-prototypes/riot',
            core: {
              builder: 'webpack5',
            },
          },
        })
      ).resolves.toBeFalsy();
    });

    it('in sb 7 with correct structure already', async () => {
      const packageJson = { dependencies: { '@junk-temporary-prototypes/angular': '^7.0.0' } };
      await expect(
        checkNewFrameworks({
          packageJson,
          main: {
            framework: '@junk-temporary-prototypes/angular',
          },
        })
      ).resolves.toBeFalsy();
    });
  });

  describe('should throw an error', () => {
    it('in sb 7 with no main.js', async () => {
      const packageJson = { dependencies: { '@junk-temporary-prototypes/vue': '^7.0.0' } };
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
          '@junk-temporary-prototypes/react': '^7.0.0',
          '@junk-temporary-prototypes/builder-vite': 'x.y.z',
          vite: '^2.0.0',
        },
      };
      await expect(
        checkNewFrameworks({
          packageJson,
          main: {
            framework: '@junk-temporary-prototypes/react',
            core: {
              builder: '@junk-temporary-prototypes/builder-vite',
            },
          },
        })
      ).rejects.toBeTruthy();
    });
  });

  describe('generic new-frameworks migration', () => {
    it('should update to @junk-temporary-prototypes/react-webpack5', async () => {
      const packageJson = {
        dependencies: {
          '@junk-temporary-prototypes/react': '^7.0.0-alpha.0',
          '@junk-temporary-prototypes/builder-webpack5': '^6.5.9',
          '@junk-temporary-prototypes/manager-webpack5': '^6.5.9',
        },
      };
      await expect(
        checkNewFrameworks({
          packageJson,
          main: {
            framework: '@junk-temporary-prototypes/react',
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
          frameworkPackage: '@junk-temporary-prototypes/react-webpack5',
          dependenciesToAdd: ['@junk-temporary-prototypes/react-webpack5'],
          dependenciesToRemove: ['@junk-temporary-prototypes/builder-webpack5', '@junk-temporary-prototypes/manager-webpack5'],
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

    it('should update to @junk-temporary-prototypes/react-vite', async () => {
      const packageJson = {
        dependencies: {
          '@junk-temporary-prototypes/react': '^7.0.0-alpha.0',
          '@junk-temporary-prototypes/builder-vite': '^0.0.2',
          vite: '3.0.0',
        },
      };
      await expect(
        checkNewFrameworks({
          packageJson,
          main: {
            framework: '@junk-temporary-prototypes/react',
            core: {
              builder: '@junk-temporary-prototypes/builder-vite',
            },
          },
        })
      ).resolves.toEqual(
        expect.objectContaining({
          frameworkPackage: '@junk-temporary-prototypes/react-vite',
          dependenciesToAdd: ['@junk-temporary-prototypes/react-vite'],
          dependenciesToRemove: ['@junk-temporary-prototypes/builder-vite'],
        })
      );
    });

    it('should update only builders in @junk-temporary-prototypes/angular', async () => {
      const packageJson = {
        dependencies: {
          '@junk-temporary-prototypes/angular': '^7.0.0-alpha.0',
          '@junk-temporary-prototypes/builder-webpack5': '^6.5.9',
          '@junk-temporary-prototypes/manager-webpack5': '^6.5.9',
        },
      };
      await expect(
        checkNewFrameworks({
          packageJson,
          main: {
            framework: '@junk-temporary-prototypes/angular',
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
          frameworkPackage: '@junk-temporary-prototypes/angular',
          dependenciesToAdd: [],
          dependenciesToRemove: ['@junk-temporary-prototypes/builder-webpack5', '@junk-temporary-prototypes/manager-webpack5'],
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

    it('should update to @junk-temporary-prototypes/preact-vite', async () => {
      const packageJson = {
        dependencies: {
          '@junk-temporary-prototypes/preact': '^7.0.0-alpha.0',
          '@junk-temporary-prototypes/builder-vite': '^0.0.2',
          vite: '3.0.0',
        },
      };
      await expect(
        checkNewFrameworks({
          packageJson,
          main: {
            framework: '@junk-temporary-prototypes/preact',
            core: {
              builder: '@junk-temporary-prototypes/builder-vite',
            },
          },
        })
      ).resolves.toEqual(
        expect.objectContaining({
          frameworkPackage: '@junk-temporary-prototypes/preact-vite',
          dependenciesToAdd: ['@junk-temporary-prototypes/preact-vite'],
          dependenciesToRemove: ['@junk-temporary-prototypes/builder-vite'],
        })
      );
    });

    it('should update correctly when there is no builder', async () => {
      const packageJson = {
        dependencies: { '@junk-temporary-prototypes/vue': '^7.0.0', '@junk-temporary-prototypes/builder-webpack5': '^7.0.0' },
      };
      await expect(
        checkNewFrameworks({
          packageJson,
          main: {
            framework: '@junk-temporary-prototypes/vue',
          },
        })
      ).resolves.toEqual(
        expect.objectContaining({
          frameworkPackage: '@junk-temporary-prototypes/vue-webpack5',
          dependenciesToAdd: ['@junk-temporary-prototypes/vue-webpack5'],
          dependenciesToRemove: ['@junk-temporary-prototypes/builder-webpack5'],
        })
      );
    });

    it('should update when there is no framework field in main', async () => {
      const packageJson = {
        dependencies: { '@junk-temporary-prototypes/vue': '^7.0.0', '@junk-temporary-prototypes/manager-webpack5': '^7.0.0' },
      };
      await expect(
        checkNewFrameworks({
          packageJson,
          main: {},
        })
      ).resolves.toEqual(
        expect.objectContaining({
          frameworkPackage: '@junk-temporary-prototypes/vue-webpack5',
          dependenciesToAdd: ['@junk-temporary-prototypes/vue-webpack5'],
          dependenciesToRemove: ['@junk-temporary-prototypes/manager-webpack5'],
          hasFrameworkInMainConfig: false,
        })
      );
    });

    it('should update when the framework field has a legacy value', async () => {
      const packageJson = {
        dependencies: { '@junk-temporary-prototypes/vue': '^7.0.0', '@junk-temporary-prototypes/manager-webpack5': '^7.0.0' },
      };
      await expect(
        checkNewFrameworks({
          packageJson,
          main: {
            framework: 'vue',
          },
        })
      ).resolves.toEqual(
        expect.objectContaining({
          frameworkPackage: '@junk-temporary-prototypes/vue-webpack5',
          dependenciesToAdd: ['@junk-temporary-prototypes/vue-webpack5'],
          dependenciesToRemove: ['@junk-temporary-prototypes/manager-webpack5'],
          hasFrameworkInMainConfig: false,
        })
      );
    });

    it('should prompt when there are multiple renderer packages', async () => {
      // there should be a prompt, which we mock the response
      const detectRendererSpy = jest.spyOn(rendererHelpers, 'detectRenderer');
      detectRendererSpy.mockReturnValueOnce(Promise.resolve('@junk-temporary-prototypes/react'));
      const packageJson = {
        dependencies: {
          '@junk-temporary-prototypes/react': '^7.0.0',
          '@junk-temporary-prototypes/vue': '^7.0.0',
          '@junk-temporary-prototypes/builder-vite': 'x.y.z',
        },
      };
      await expect(
        checkNewFrameworks({
          packageJson,
          main: {
            core: {
              builder: '@junk-temporary-prototypes/builder-vite',
            },
          },
        })
      ).resolves.toEqual(
        expect.objectContaining({
          frameworkPackage: '@junk-temporary-prototypes/react-vite',
          dependenciesToRemove: ['@junk-temporary-prototypes/builder-vite'],
        })
      );
      expect(detectRendererSpy).toHaveBeenCalled();
    });

    it('should add framework field in main.js when everything is properly configured, but framework field in main.js is missing', async () => {
      const packageJson = {
        dependencies: {
          '@junk-temporary-prototypes/react': '^7.0.0-alpha.0',
          '@junk-temporary-prototypes/react-vite': '^7.0.0-alpha.0',
        },
      };

      // project contains vite.config.js
      jest.spyOn(findUp, 'default').mockReturnValueOnce(Promise.resolve('vite.config.js'));
      await expect(
        checkNewFrameworks({
          packageJson,
          main: {},
        })
      ).resolves.toEqual(
        expect.objectContaining({
          hasFrameworkInMainConfig: false,
          frameworkPackage: '@junk-temporary-prototypes/react-vite',
        })
      );
    });

    it('should migrate to @junk-temporary-prototypes/web-components-webpack5 in a monorepo that contains the vite builder, but main.js has webpack5 in builder field', async () => {
      jest
        .spyOn(rendererHelpers, 'detectRenderer')
        .mockReturnValueOnce(Promise.resolve('@junk-temporary-prototypes/web-components'));
      const packageJson = {
        dependencies: {
          '@junk-temporary-prototypes/addon-essentials': '^7.0.0-beta.48',
          '@junk-temporary-prototypes/vue': '^7.0.0-beta.48',
          '@junk-temporary-prototypes/builder-vite': '^7.0.0-beta.48',
          '@junk-temporary-prototypes/builder-webpack5': '^7.0.0-beta.48',
          '@junk-temporary-prototypes/core-server': '^7.0.0-beta.48',
          '@junk-temporary-prototypes/manager-webpack5': '^6.5.15',
          '@junk-temporary-prototypes/react': '^7.0.0-beta.48',
          '@junk-temporary-prototypes/web-components': '^7.0.0-beta.48',
        },
      };
      await expect(
        checkNewFrameworks({
          packageJson,
          main: {
            core: { builder: 'webpack5' },
          },
        })
      ).resolves.toEqual(
        expect.objectContaining({
          hasFrameworkInMainConfig: false,
          frameworkPackage: '@junk-temporary-prototypes/web-components-webpack5',
        })
      );
    });
  });

  describe('nextjs migration', () => {
    it('skips in non-Next.js projects', async () => {
      const packageJson = {
        dependencies: {
          '@junk-temporary-prototypes/react': '^7.0.0',
          '@junk-temporary-prototypes/react-vite': '^7.0.0',
        },
      };
      const main = {
        framework: '@junk-temporary-prototypes/react-vite',
      };
      await expect(checkNewFrameworks({ packageJson, main })).resolves.toBeFalsy();
    });

    it('skips if project uses Next.js < 12.0.0', async () => {
      const packageJson = {
        dependencies: {
          '@junk-temporary-prototypes/react': '^7.0.0',
          '@junk-temporary-prototypes/react-webpack5': '^7.0.0',
          next: '^11.0.0',
        },
      };
      const main = {
        framework: '@junk-temporary-prototypes/react',
      };
      await expect(checkNewFrameworks({ packageJson, main })).resolves.toBeFalsy();
    });

    it('skips if project already has @junk-temporary-prototypes/nextjs set up', async () => {
      jest.spyOn(findUp, 'default').mockReturnValueOnce(Promise.resolve('next.config.js'));
      const packageJson = {
        dependencies: {
          '@junk-temporary-prototypes/react': '^7.0.0',
          '@junk-temporary-prototypes/nextjs': '^7.0.0',
          next: '^12.0.0',
        },
      };
      const main = {
        framework: '@junk-temporary-prototypes/nextjs',
      };
      await expect(checkNewFrameworks({ packageJson, main })).resolves.toBeFalsy();
    });

    it('should update from @junk-temporary-prototypes/react-webpack5 to @junk-temporary-prototypes/nextjs', async () => {
      const packageJson = {
        dependencies: {
          '@junk-temporary-prototypes/react': '^7.0.0-alpha.0',
          '@junk-temporary-prototypes/react-webpack5': '^7.0.0-alpha.0',
          '@junk-temporary-prototypes/builder-webpack5': '^7.0.0-alpha.0',
          next: '^12.0.0',
        },
      };

      jest.spyOn(findUp, 'default').mockReturnValueOnce(Promise.resolve('next.config.js'));
      await expect(
        checkNewFrameworks({
          packageJson,
          main: {
            framework: { name: '@junk-temporary-prototypes/react-webpack5', options: {} },
          },
        })
      ).resolves.toEqual(
        expect.objectContaining({
          frameworkPackage: '@junk-temporary-prototypes/nextjs',
          dependenciesToAdd: ['@junk-temporary-prototypes/nextjs'],
          dependenciesToRemove: ['@junk-temporary-prototypes/builder-webpack5', '@junk-temporary-prototypes/react-webpack5'],
        })
      );
    });

    it('should remove legacy addons', async () => {
      jest.spyOn(findUp, 'default').mockReturnValueOnce(Promise.resolve('next.config.js'));
      const packageJson = {
        dependencies: {
          '@junk-temporary-prototypes/react': '^7.0.0-alpha.0',
          '@junk-temporary-prototypes/react-webpack5': '^7.0.0-alpha.0',
          next: '^12.0.0',
          'storybook-addon-next': '^1.0.0',
          'storybook-addon-next-router': '^1.0.0',
        },
      };
      await expect(
        checkNewFrameworks({
          packageJson,
          main: {
            framework: '@junk-temporary-prototypes/react-webpack5',
            addons: ['storybook-addon-next', 'storybook-addon-next-router'],
          },
        })
      ).resolves.toEqual(
        expect.objectContaining({
          addonsToRemove: ['storybook-addon-next', 'storybook-addon-next-router'],
          dependenciesToRemove: [
            '@junk-temporary-prototypes/react-webpack5',
            'storybook-addon-next',
            'storybook-addon-next-router',
          ],
        })
      );
    });

    it('should move storybook-addon-next options and reactOptions to frameworkOptions', async () => {
      jest.spyOn(findUp, 'default').mockReturnValueOnce(Promise.resolve('next.config.js'));
      const packageJson = {
        dependencies: {
          '@junk-temporary-prototypes/react': '^7.0.0-alpha.0',
          '@junk-temporary-prototypes/react-webpack5': '^7.0.0-alpha.0',
          next: '^12.0.0',
          'storybook-addon-next': '^1.0.0',
        },
      };
      await expect(
        checkNewFrameworks({
          packageJson,
          main: {
            framework: { name: '@junk-temporary-prototypes/react-webpack5', options: { fastRefresh: true } },
            addons: [
              {
                name: 'storybook-addon-next',
                options: {
                  nextConfigPath: '../next.config.js',
                },
              },
            ],
            core: {
              builder: {
                name: '@junk-temporary-prototypes/builder-webpack5',
                options: { lazyCompilation: true },
              },
            },
          },
        })
      ).resolves.toEqual(
        expect.objectContaining({
          frameworkPackage: '@junk-temporary-prototypes/nextjs',
          dependenciesToAdd: ['@junk-temporary-prototypes/nextjs'],
          dependenciesToRemove: ['@junk-temporary-prototypes/react-webpack5', 'storybook-addon-next'],
          addonsToRemove: ['storybook-addon-next'],
          frameworkOptions: {
            fastRefresh: true,
            nextConfigPath: '../next.config.js',
          },
          builderInfo: {
            name: 'webpack5',
            options: { lazyCompilation: true },
          },
        })
      );
    });

    it('should migrate to @junk-temporary-prototypes/react-vite in Next.js project that uses vite builder', async () => {
      jest.spyOn(findUp, 'default').mockReturnValueOnce(Promise.resolve('next.config.js'));
      const packageJson = {
        dependencies: {
          '@junk-temporary-prototypes/react': '^7.0.0-alpha.0',
          '@junk-temporary-prototypes/builder-vite': '^7.0.0-alpha.0',
          next: '^12.0.0',
          'storybook-addon-next': '^1.0.0',
        },
      };
      await expect(
        checkNewFrameworks({
          packageJson,
          main: {
            core: {
              builder: '@junk-temporary-prototypes/builder-vite',
            },
          },
        })
      ).resolves.toEqual(
        expect.objectContaining({
          addonsToRemove: [],
          dependenciesToAdd: ['@junk-temporary-prototypes/react-vite'],
          dependenciesToRemove: ['@junk-temporary-prototypes/builder-vite'],
          frameworkPackage: '@junk-temporary-prototypes/react-vite',
        })
      );
    });
  });

  describe('SvelteKit migration', () => {
    it('skips in non-SvelteKit projects', async () => {
      const packageJson = {
        dependencies: {
          svelte: '^3.53.1',
          '@junk-temporary-prototypes/svelte': '^7.0.0',
          '@junk-temporary-prototypes/svelte-vite': '^7.0.0',
        },
      };
      const main = {
        framework: '@junk-temporary-prototypes/svelte-vite',
      };
      await expect(checkNewFrameworks({ packageJson, main })).resolves.toBeFalsy();
    });

    it('skips if project uses SvelteKit < 1.0.0', async () => {
      const packageJson = {
        dependencies: {
          '@junk-temporary-prototypes/svelte': '^7.0.0',
          '@junk-temporary-prototypes/svelte-vite': '^7.0.0',
          '@sveltejs/kit': '^0.9.0',
        },
      };
      const main = {
        framework: '@junk-temporary-prototypes/svelte-vite',
      };
      await expect(checkNewFrameworks({ packageJson, main })).resolves.toBeFalsy();
    });

    it('skips if project already has @junk-temporary-prototypes/sveltekit set up', async () => {
      const packageJson = {
        dependencies: {
          '@junk-temporary-prototypes/svelte': '^7.0.0',
          '@junk-temporary-prototypes/sveltekit': '^7.0.0',
          '@sveltejs/kit': '^1.0.0',
        },
      };
      const main = {
        framework: '@junk-temporary-prototypes/svelte-vite',
      };
      await expect(checkNewFrameworks({ packageJson, main })).resolves.toBeFalsy();
    });

    it('from @junk-temporary-prototypes/svelte-vite', async () => {
      const packageJson = {
        dependencies: {
          '@junk-temporary-prototypes/svelte': '^7.0.0',
          '@junk-temporary-prototypes/svelte-vite': '^7.0.0',
          '@sveltejs/kit': '^1.0.0',
        },
      };
      const main = {
        framework: '@junk-temporary-prototypes/svelte-vite',
      };
      await expect(checkNewFrameworks({ packageJson, main })).resolves.toEqual(
        expect.objectContaining({
          dependenciesToAdd: ['@junk-temporary-prototypes/sveltekit'],
          dependenciesToRemove: ['@junk-temporary-prototypes/svelte-vite'],
          frameworkPackage: '@junk-temporary-prototypes/sveltekit',
        })
      );
    });

    it('from @junk-temporary-prototypes/svelte framework and @junk-temporary-prototypes/builder-vite builder', async () => {
      const packageJson = {
        dependencies: {
          '@junk-temporary-prototypes/svelte': '^7.0.0',
          '@junk-temporary-prototypes/builder-vite': '^7.0.0',
          '@sveltejs/kit': '^1.0.0',
        },
      };
      const main = {
        framework: '@junk-temporary-prototypes/svelte',
        core: { builder: '@junk-temporary-prototypes/builder-vite' },
      };
      await expect(checkNewFrameworks({ packageJson, main })).resolves.toEqual(
        expect.objectContaining({
          dependenciesToAdd: ['@junk-temporary-prototypes/sveltekit'],
          dependenciesToRemove: ['@junk-temporary-prototypes/builder-vite'],
          frameworkPackage: '@junk-temporary-prototypes/sveltekit',
        })
      );
    });

    it('from @junk-temporary-prototypes/svelte framework and storybook-builder-vite builder', async () => {
      const packageJson = {
        dependencies: {
          '@junk-temporary-prototypes/svelte': '^7.0.0',
          'storybook-builder-vite': '^0.2.5',
          '@sveltejs/kit': '^1.0.0',
        },
      };
      const main = {
        framework: '@junk-temporary-prototypes/svelte',
        core: { builder: 'storybook-builder-vite' },
      };
      await expect(checkNewFrameworks({ packageJson, main })).resolves.toEqual(
        expect.objectContaining({
          dependenciesToAdd: ['@junk-temporary-prototypes/sveltekit'],
          dependenciesToRemove: ['storybook-builder-vite'],
          frameworkPackage: '@junk-temporary-prototypes/sveltekit',
        })
      );
    });

    it('should migrate and remove svelteOptions', async () => {
      const packageJson = {
        dependencies: {
          '@junk-temporary-prototypes/svelte': '^7.0.0',
          'storybook-builder-vite': '^0.2.5',
          '@sveltejs/kit': '^1.0.0',
        },
      };
      const main = {
        framework: '@junk-temporary-prototypes/svelte',
        core: { builder: 'storybook-builder-vite' },
        svelteOptions: { preprocess: 'preprocess' },
      };
      await expect(checkNewFrameworks({ packageJson, main })).resolves.toEqual(
        expect.objectContaining({
          dependenciesToAdd: ['@junk-temporary-prototypes/sveltekit'],
          dependenciesToRemove: ['storybook-builder-vite'],
          frameworkPackage: '@junk-temporary-prototypes/sveltekit',
          rendererOptions: {},
        })
      );
    });

    it('should migrate to @junk-temporary-prototypes/svelte-webpack5 in SvelteKit project that uses Webpack5 builder', async () => {
      const packageJson = {
        dependencies: {
          '@junk-temporary-prototypes/svelte': '^7.0.0-alpha.0',
          '@junk-temporary-prototypes/builder-webpack5': '^7.0.0-alpha.0',
          '@sveltejs/kit': '^1.0.0',
        },
      };
      await expect(
        checkNewFrameworks({
          packageJson,
          main: {
            core: {
              builder: '@junk-temporary-prototypes/builder-webpack5',
            },
          },
        })
      ).resolves.toEqual(
        expect.objectContaining({
          addonsToRemove: [],
          dependenciesToAdd: ['@junk-temporary-prototypes/svelte-webpack5'],
          dependenciesToRemove: ['@junk-temporary-prototypes/builder-webpack5'],
          frameworkPackage: '@junk-temporary-prototypes/svelte-webpack5',
        })
      );
    });
  });
});

/* eslint-disable no-underscore-dangle */
import type { StorybookConfig } from 'lib/types/src';
import path from 'path';
import type { JsPackageManager, PackageJson } from '../../js-package-manager';
import { sveltekitFramework } from './sveltekit-framework';

// eslint-disable-next-line global-require, jest/no-mocks-import
jest.mock('fs-extra', () => require('../../../../../__mocks__/fs-extra'));

const checkSvelteKitFramework = async ({
  packageJson,
  main,
}: {
  packageJson: PackageJson;
  main?: Partial<StorybookConfig>;
}) => {
  if (main) {
    // eslint-disable-next-line global-require
    require('fs-extra').__setMockFiles({
      [path.join('.storybook', 'main.js')]: `module.exports = ${JSON.stringify(main)};`,
    });
  }
  const packageManager = {
    retrievePackageJson: () => ({ dependencies: {}, devDependencies: {}, ...packageJson }),
  } as JsPackageManager;

  return sveltekitFramework.check({ packageManager });
};

describe('SvelteKit framework fix', () => {
  describe('should no-op', () => {
    it('in sb < 7', async () => {
      const packageJson = { dependencies: { '@storybook/svelte': '^6.2.0' } };
      const main = { framework: '@storybook/svelte-vite' };
      await expect(checkSvelteKitFramework({ packageJson, main })).resolves.toBeFalsy();
    });

    it('in sb 7 with no main', async () => {
      const packageJson = { dependencies: { '@storybook/svelte': '^7.0.0' } };
      await expect(checkSvelteKitFramework({ packageJson })).resolves.toBeFalsy();
    });

    it('in sb 7 with no framework field in main', async () => {
      const packageJson = { dependencies: { '@storybook/sve{te': '^7.0.0' } };
      const main = {};
      await expect(checkSvelteKitFramework({ packageJson, main })).resolves.toBeFalsy();
    });

    it('in sb 7 in non-SvelteKit projects', async () => {
      const packageJson = { dependencies: { '@storybook/svelte-vite': '^7.0.0' } };
      const main = {
        framework: '@storybook/svelte-vite',
      };
      await expect(checkSvelteKitFramework({ packageJson, main })).resolves.toBeFalsy();
    });

    it('in sb 7 with unsupported builder', async () => {
      const packageJson = { dependencies: { '@storybook/svelte-webpack5': '^7.0.0' } };
      const main = {
        framework: '@storybook/svelte-webpack5',
      };
      await expect(checkSvelteKitFramework({ packageJson, main })).resolves.toBeFalsy();
    });
  });

  describe('sb > 7', () => {
    it('should update from @storybook/svelte-vite to @storybook/sveltekit', async () => {
      const packageJson = {
        dependencies: {
          '@storybook/svelte': '^7.0.0',
          '@storybook/svelte-vite': '^7.0.0',
          '@sveltejs/kit': '^1.0.0-next.571',
        },
      };
      const main = {
        framework: '@storybook/svelte-vite',
      };
      await expect(checkSvelteKitFramework({ packageJson, main })).resolves.toMatchObject({
        packageJson,
        main: expect.objectContaining({}),
        frameworkOptions: undefined,
      });
    });

    it('should warn for @storybook/svelte-webpack5 users', async () => {
      const packageJson = {
        dependencies: {
          '@storybook/svelte': '^7.0.0',
          '@storybook/svelte-webpack5': '^7.0.0',
          '@sveltejs/kit': '^1.0.0-next.571',
        },
      };
      const main = {
        framework: '@storybook/svelte-webpack5',
      };
      await expect(checkSvelteKitFramework({ packageJson, main })).rejects
        .toThrowErrorMatchingInlineSnapshot(`
        "warn: We've detected you are using Storybook in a SvelteKit project.

        In Storybook 7, we introduced a new framework package for SvelteKit projects: @storybook/sveltekit.

        This package provides a better experience for SvelteKit users, however it is only compatible with the Vite builder, so we can't automigrate for you, as you are using another builder.

        If you are interested in using this package, see: [33mhttps://github.com/storybookjs/storybook/blob/next/MIGRATION.md#sveltekit-needs-the-storybooksveltekit-framework[39m"
      `);
    });
  });
});

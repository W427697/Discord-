import type { Mock } from 'vitest';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import fs from 'fs';
import fse from 'fs-extra';

import * as helpers from './helpers';
import type { JsPackageManager } from './js-package-manager';
import type { SupportedRenderers } from './project_types';
import { SupportedLanguage } from './project_types';

vi.mock('fs', () => ({
  existsSync: vi.fn(),
}));
vi.mock('./dirs', () => ({
  getRendererDir: (_: JsPackageManager, renderer: string) => `@storybook/${renderer}`,
  getCliDir: () => '@storybook/cli',
}));

vi.mock('fs-extra', () => ({
  copySync: vi.fn(() => ({})),
  copy: vi.fn(() => ({})),
  ensureDir: vi.fn(() => {}),
  existsSync: vi.fn(),
  pathExists: vi.fn(),
  readFile: vi.fn(() => ''),
  writeFile: vi.fn(),
}));

vi.mock('find-up', () => ({
  sync: vi.fn(),
}));

vi.mock('path', async () => {
  const path = await vi.importActual('path');
  return {
    // make it return just the second path, for easier testing
    resolve: vi.fn((_, p) => p),
    dirname: path.dirname,
    join: path.join,
  };
});

const packageManagerMock = {
  retrievePackageJson: async () => ({ dependencies: {}, devDependencies: {} }),
} as JsPackageManager;

describe('Helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('copyTemplate', () => {
    it(`should copy template files when directory is present`, () => {
      const csfDirectory = `template-csf/`;
      (fs.existsSync as Mock).mockImplementation((filePath) => {
        return true;
      });
      helpers.copyTemplate('');

      const copySyncSpy = vi.spyOn(fse, 'copySync');
      expect(copySyncSpy).toHaveBeenCalledWith(csfDirectory, expect.anything(), expect.anything());
    });

    it(`should throw an error if template directory cannot be found`, () => {
      (fs.existsSync as Mock).mockImplementation((filePath) => {
        return false;
      });

      expect(() => {
        helpers.copyTemplate('');
      }).toThrowError("Couldn't find template dir");
    });
  });

  it.each`
    language            | exists                        | expected
    ${'javascript'}     | ${['js', 'ts-4-9']}           | ${'/js'}
    ${'typescript-4-9'} | ${['js', 'ts-4-9']}           | ${'/ts-4-9'}
    ${'typescript-4-9'} | ${['js', 'ts-3-8']}           | ${'/ts-3-8'}
    ${'typescript-3-8'} | ${['js', 'ts-3-8', 'ts-4-9']} | ${'/ts-3-8'}
    ${'typescript-3-8'} | ${['js', 'ts-4-9']}           | ${'/js'}
    ${'typescript-4-9'} | ${['js']}                     | ${'/js'}
    ${'javascript'}     | ${[]}                         | ${''}
    ${'typescript-4-9'} | ${[]}                         | ${''}
  `(
    `should copy $expected when folder $exists exists for language $language`,
    async ({ language, exists, expected }) => {
      const componentsDirectory = exists.map(
        (folder: string) => `@storybook/react/template/cli/${folder}`
      );
      (fse.pathExists as Mock).mockImplementation(
        (filePath) =>
          componentsDirectory.includes(filePath) || filePath === '@storybook/react/template/cli'
      );
      await helpers.copyTemplateFiles({
        renderer: 'react',
        language,
        packageManager: packageManagerMock,
      });

      const copySpy = vi.spyOn(fse, 'copy');
      expect(copySpy).toHaveBeenNthCalledWith(
        1,
        '@storybook/cli/rendererAssets/common',
        './stories',
        expect.anything()
      );

      const expectedDirectory = `@storybook/react/template/cli${expected}`;
      expect(copySpy).toHaveBeenNthCalledWith(2, expectedDirectory, './stories', expect.anything());
    }
  );

  it(`should copy to src folder when exists`, async () => {
    (fse.pathExists as Mock).mockImplementation((filePath) => {
      return filePath === '@storybook/react/template/cli' || filePath === './src';
    });
    await helpers.copyTemplateFiles({
      renderer: 'react',
      language: SupportedLanguage.JAVASCRIPT,
      packageManager: packageManagerMock,
    });
    expect(fse.copy).toHaveBeenCalledWith(expect.anything(), './src/stories', expect.anything());
  });

  it(`should copy to root folder when src doesn't exist`, async () => {
    (fse.pathExists as Mock).mockImplementation((filePath) => {
      return filePath === '@storybook/react/template/cli';
    });
    await helpers.copyTemplateFiles({
      renderer: 'react',
      language: SupportedLanguage.JAVASCRIPT,
      packageManager: packageManagerMock,
    });
    expect(fse.copy).toHaveBeenCalledWith(expect.anything(), './stories', expect.anything());
  });

  it(`should throw an error for unsupported renderer`, async () => {
    const renderer = 'unknown renderer' as SupportedRenderers;
    const expectedMessage = `Unsupported renderer: ${renderer}`;
    await expect(
      helpers.copyTemplateFiles({
        renderer,
        language: SupportedLanguage.JAVASCRIPT,
        packageManager: packageManagerMock,
      })
    ).rejects.toThrowError(expectedMessage);
  });

  describe('getStorybookVersionSpecifier', () => {
    it(`should return the specifier if storybook lib exists in package.json`, () => {
      expect(
        helpers.getStorybookVersionSpecifier({
          dependencies: {},
          devDependencies: {
            '@storybook/react': '^x.x.x',
          },
        })
      ).toEqual('^x.x.x');
    });

    it(`should throw an error if no package is found`, () => {
      expect(() => {
        helpers.getStorybookVersionSpecifier({
          dependencies: {},
          devDependencies: {
            'something-else': '^x.x.x',
          },
        });
      }).toThrowError("Couldn't find any official storybook packages in package.json");
    });
  });
});

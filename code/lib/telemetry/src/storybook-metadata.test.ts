import type { PackageJson, StorybookConfig } from '@junk-temporary-prototypes/types';

import path from 'path';
import { computeStorybookMetadata, metaFrameworks, sanitizeAddonName } from './storybook-metadata';

const packageJsonMock: PackageJson = {
  name: 'some-user-project',
  version: 'x.x.x',
};

const mainJsMock: StorybookConfig = {
  stories: [],
};

jest.mock('./package-json', () => {
  const getActualPackageVersion = jest.fn((name) =>
    Promise.resolve({
      name,
      version: 'x.x.x',
    })
  );

  const getActualPackageVersions = jest.fn((packages) =>
    Promise.all(Object.keys(packages).map(getActualPackageVersion))
  );

  const getActualPackageJson = jest.fn((name) => ({
    dependencies: {
      '@junk-temporary-prototypes/react': 'x.x.x',
      '@junk-temporary-prototypes/builder-vite': 'x.x.x',
    },
  }));

  return {
    getActualPackageVersions,
    getActualPackageVersion,
    getActualPackageJson,
  };
});

jest.mock('./get-monorepo-type', () => ({
  getMonorepoType: () => 'Nx',
}));

jest.mock('detect-package-manager', () => ({
  detect: () => 'Yarn',
  getNpmVersion: () => '3.1.1',
}));

describe('sanitizeAddonName', () => {
  const originalSep = path.sep;
  beforeEach(() => {
    // @ts-expect-error the property is read only but we can change it for testing purposes
    path.sep = originalSep;
  });

  test('special addon names', () => {
    const addonNames = [
      '@junk-temporary-prototypes/preset-create-react-app',
      'storybook-addon-deprecated/register',
      'storybook-addon-ends-with-js/register.js',
      '@junk-temporary-prototypes/addon-knobs/preset',
      '@junk-temporary-prototypes/addon-ends-with-js/preset.js',
      '@junk-temporary-prototypes/addon-postcss/dist/index.js',
      '../local-addon/register.js',
      '../../',
    ].map(sanitizeAddonName);

    expect(addonNames).toEqual([
      '@junk-temporary-prototypes/preset-create-react-app',
      'storybook-addon-deprecated',
      'storybook-addon-ends-with-js',
      '@junk-temporary-prototypes/addon-knobs',
      '@junk-temporary-prototypes/addon-ends-with-js',
      '@junk-temporary-prototypes/addon-postcss',
      '../local-addon',
      '../../',
    ]);
  });

  test('Windows paths', () => {
    // @ts-expect-error the property is read only but we can change it for testing purposes
    path.sep = '\\';
    const cwdMockPath = `C:\\Users\\username\\storybook-app`;
    jest.spyOn(process, `cwd`).mockImplementationOnce(() => cwdMockPath);

    expect(sanitizeAddonName(`${cwdMockPath}\\local-addon\\themes.js`)).toEqual(
      '$SNIP\\local-addon\\themes'
    );
  });

  test('Linux paths', () => {
    // @ts-expect-error the property is read only but we can change it for testing purposes
    path.sep = '/';
    const cwdMockPath = `/Users/username/storybook-app`;
    jest.spyOn(process, `cwd`).mockImplementationOnce(() => cwdMockPath);

    expect(sanitizeAddonName(`${cwdMockPath}/local-addon/themes.js`)).toEqual(
      '$SNIP/local-addon/themes'
    );
  });
});

describe('await computeStorybookMetadata', () => {
  test('should return frameworkOptions from mainjs', async () => {
    const reactResult = await computeStorybookMetadata({
      packageJson: packageJsonMock,
      mainConfig: {
        ...mainJsMock,
        framework: {
          name: '@junk-temporary-prototypes/react-vite',
          options: {
            fastRefresh: false,
          },
        },
      },
    });

    expect(reactResult.framework).toEqual({
      name: '@junk-temporary-prototypes/react-vite',
      options: { fastRefresh: false },
    });

    const angularResult = await computeStorybookMetadata({
      packageJson: packageJsonMock,
      mainConfig: {
        ...mainJsMock,
        framework: {
          name: '@junk-temporary-prototypes/angular',
          options: {
            enableIvy: true,
            enableNgcc: true,
          },
        },
      },
    });

    expect(angularResult.framework).toEqual({
      name: '@junk-temporary-prototypes/angular',
      options: { enableIvy: true, enableNgcc: true },
    });
  });

  test('should separate storybook packages and addons', async () => {
    const result = await computeStorybookMetadata({
      packageJson: {
        ...packageJsonMock,
        devDependencies: {
          '@junk-temporary-prototypes/react': 'x.y.z',
          '@junk-temporary-prototypes/addon-essentials': 'x.x.x',
          '@junk-temporary-prototypes/addon-knobs': 'x.x.y',
          'storybook-addon-deprecated': 'x.x.z',
        },
      },
      mainConfig: {
        ...mainJsMock,
        addons: [
          '@junk-temporary-prototypes/addon-essentials',
          'storybook-addon-deprecated/register',
          '@junk-temporary-prototypes/addon-knobs/preset',
        ],
      },
    });

    expect(result.addons).toMatchInlineSnapshot(`
      Object {
        "@junk-temporary-prototypes/addon-essentials": Object {
          "options": undefined,
          "version": "x.x.x",
        },
        "@junk-temporary-prototypes/addon-knobs": Object {
          "options": undefined,
          "version": "x.x.x",
        },
        "storybook-addon-deprecated": Object {
          "options": undefined,
          "version": "x.x.x",
        },
      }
    `);
    expect(result.storybookPackages).toMatchInlineSnapshot(`
      Object {
        "@junk-temporary-prototypes/react": Object {
          "version": "x.x.x",
        },
      }
    `);
  });

  test('should return user specified features', async () => {
    const features = {
      storyStoreV7: true,
    };

    const result = await computeStorybookMetadata({
      packageJson: packageJsonMock,
      mainConfig: {
        ...mainJsMock,
        features,
      },
    });

    expect(result.features).toEqual(features);
  });

  test('should infer builder and renderer from framework package.json', async () => {
    expect(
      await computeStorybookMetadata({
        packageJson: packageJsonMock,
        mainConfig: {
          ...mainJsMock,
          framework: '@junk-temporary-prototypes/react-vite',
        },
      })
    ).toMatchObject({
      framework: { name: '@junk-temporary-prototypes/react-vite' },
      renderer: '@junk-temporary-prototypes/react',
      builder: '@junk-temporary-prototypes/builder-vite',
    });
  });

  test('should return the number of refs', async () => {
    const res = await computeStorybookMetadata({
      packageJson: packageJsonMock,
      mainConfig: {
        ...mainJsMock,
        refs: {
          a: { title: '', url: '' },
          b: { title: '', url: '' },
        },
      },
    });
    expect(res.refCount).toEqual(2);
  });

  test.each(Object.entries(metaFrameworks))(
    'should detect the supported metaframework: %s',
    async (metaFramework, name) => {
      const res = await computeStorybookMetadata({
        packageJson: {
          ...packageJsonMock,
          dependencies: {
            [metaFramework]: 'x.x.x',
          },
        },
        mainConfig: mainJsMock,
      });
      expect(res.metaFramework).toEqual({
        name,
        packageName: metaFramework,
        version: 'x.x.x',
      });
    }
  );
});

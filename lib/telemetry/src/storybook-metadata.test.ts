import { PackageJson, StorybookConfig } from '@storybook/core-common';
import { computeStorybookMetadata, metaFrameworks } from './storybook-metadata';

const packageJsonMock: PackageJson = {
  name: 'some-user-project',
  version: 'x.x.x',
};

const mainJsMock: StorybookConfig = {
  stories: [],
};

describe('computeStorybookMetadata', () => {
  test('should return frameworkOptions from mainjs', () => {
    const reactResult = computeStorybookMetadata({
      packageJson: {
        ...packageJsonMock,
        devDependencies: {
          '@storybook/react': 'x.x.x',
        },
      },
      mainConfig: {
        ...mainJsMock,
        reactOptions: {
          fastRefresh: false,
        },
      },
    });

    expect(reactResult.framework).toEqual({ name: 'react', options: { fastRefresh: false } });

    const angularResult = computeStorybookMetadata({
      packageJson: {
        ...packageJsonMock,
        devDependencies: {
          '@storybook/angular': 'x.x.x',
        },
      },
      mainConfig: {
        ...mainJsMock,
        angularOptions: {
          enableIvy: true,
        },
      },
    });

    expect(angularResult.framework).toEqual({ name: 'angular', options: { enableIvy: true } });
  });

  test('should separate storybook packages and addons', () => {
    const result = computeStorybookMetadata({
      packageJson: {
        ...packageJsonMock,
        devDependencies: {
          '@storybook/react': 'x.y.z',
          '@storybook/addon-essentials': 'x.x.x',
          'storybook-addon-deprecated': 'x.x.x',
        },
      },
      mainConfig: {
        ...mainJsMock,
        addons: ['@storybook/addon-essentials', 'storybook-addon-deprecated/register'],
      },
    });

    expect(result.addons).toMatchInlineSnapshot(`
      Object {
        "@storybook/addon-essentials": Object {
          "name": "@storybook/addon-essentials",
          "options": Object {},
          "version": "x.x.x",
        },
        "storybook-addon-deprecated": Object {
          "name": "storybook-addon-deprecated",
          "options": Object {},
          "version": "x.x.x",
        },
      }
    `);
    expect(result.storybookPackages).toMatchInlineSnapshot(`
      Object {
        "@storybook/react": Object {
          "name": "@storybook/react",
          "version": "x.y.z",
        },
      }
    `);
  });

  test('should return user specified features', () => {
    const features = {
      interactionsDebugger: true,
    };

    const result = computeStorybookMetadata({
      packageJson: packageJsonMock,
      mainConfig: {
        ...mainJsMock,
        features,
      },
    });

    expect(result.features).toEqual(features);
  });

  test('should handle different types of builders', () => {
    const simpleBuilder = 'webpack4';
    const complexBuilder = {
      name: 'webpack5',
      options: {
        lazyCompilation: true,
      },
    };
    expect(
      computeStorybookMetadata({
        packageJson: packageJsonMock,
        mainConfig: {
          ...mainJsMock,
          core: {
            builder: complexBuilder,
          },
        },
      }).builder
    ).toEqual(complexBuilder);
    expect(
      computeStorybookMetadata({
        packageJson: packageJsonMock,
        mainConfig: {
          ...mainJsMock,
          core: {
            builder: simpleBuilder,
          },
        },
      }).builder
    ).toEqual({ name: simpleBuilder, options: null });
  });

  test('should return the number of refs', () => {
    const res = computeStorybookMetadata({
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
    (metaFramework, name) => {
      const res = computeStorybookMetadata({
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

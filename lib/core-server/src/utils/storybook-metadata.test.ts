import merge from 'lodash/merge';
import { Options } from '@storybook/core-common';
import { getStorybookMetadata, metaFrameworks } from './storybook-metadata';

const getMockOptions = (overrides: Partial<Options> = {}) =>
  merge(
    {
      _version: '6.5.0-alpha.46',
      managerCache: false,
      packageJson: {
        name: '@storybook/react',
        version: '6.5.0-alpha.46',
        dependencies: [Object],
        devDependencies: [Object],
        peerDependencies: [Object],
        peerDependenciesMeta: [Object],
      },
      framework: 'react',
      configDir: '.storybook',
      docsMode: false,
      features: {
        postcss: true,
        emotionAlias: true,
        telemetry: true,
        warnOnLegacyHierarchySeparator: true,
      },
    },
    overrides
  ) as Options;

describe('Storybook metadata', () => {
  test('should return frameworkOptions from mainjs', () => {
    const result = getStorybookMetadata(getMockOptions(), {
      reactOptions: {
        fastRefresh: false,
      },
    });

    expect(result.framework).toEqual({ name: 'react', options: { fastRefresh: false } });
  });

  test('should separate storybook packages and addons', () => {
    const result = getStorybookMetadata(
      getMockOptions({
        packageJson: {
          name: '',
          version: '',
          dependencies: {
            '@storybook/react': 'x.y.z',
            '@storybook/addon-essentials': 'x.x.x',
            'storybook-addon-deprecated': 'x.x.x',
          },
        },
      }),
      {
        addons: ['@storybook/addon-essentials', 'storybook-addon-deprecated/register'],
      }
    );

    expect(result.addons).toEqual([
      { name: '@storybook/addon-essentials', version: 'x.x.x' },
      { name: 'storybook-addon-deprecated', version: 'x.x.x' },
    ]);
    expect(result.storybookPackages).toEqual([{ name: '@storybook/react', version: 'x.y.z' }]);
  });

  test('should separate preset features and user specified features', () => {
    const userSpecifiedFeatures = {
      interactionsDebugger: true,
    };

    const presetFeatures = {
      postcss: true,
      emotionAlias: true,
      telemetry: true,
      warnOnLegacyHierarchySeparator: true,
    };

    const result = getStorybookMetadata(
      getMockOptions({
        features: presetFeatures,
      }),
      {
        features: userSpecifiedFeatures,
      }
    );

    expect(result.features).toEqual(presetFeatures);
    expect(result.userSpecifiedFeatures).toEqual(userSpecifiedFeatures);
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
      getStorybookMetadata(getMockOptions(), {
        core: {
          builder: complexBuilder,
        },
      }).builder
    ).toEqual(complexBuilder);
    expect(
      getStorybookMetadata(getMockOptions(), {
        core: {
          builder: simpleBuilder,
        },
      }).builder
    ).toEqual({ name: simpleBuilder, options: {} });
  });

  test('should return the number of refs', () => {
    const res = getStorybookMetadata(getMockOptions(), {
      refs: {
        a: {},
        b: {},
      },
    });
    expect(res.refCount).toEqual(2);
  });

  test.each(Object.entries(metaFrameworks))(
    'should detect the supported metaframework: %s',
    (metaFramework, name) => {
      const res = getStorybookMetadata(
        getMockOptions({
          packageJson: {
            name: '',
            version: '',
            dependencies: {
              [metaFramework]: 'x.x.x',
            },
          },
        }),
        {}
      );
      expect(res.metaFramework).toEqual({
        name,
        packageName: metaFramework,
        version: 'x.x.x',
      });
    }
  );
});

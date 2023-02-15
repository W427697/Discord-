import { getBuilderInfo as _getBuilderInfo, getNextjsAddonOptions } from './utils';

type GetBuilderInfoParams = Parameters<typeof _getBuilderInfo>[0];

const getBuilderInfo = (mainConfig: Partial<GetBuilderInfoParams>) =>
  _getBuilderInfo(mainConfig as GetBuilderInfoParams);

describe('getBuilderInfo', () => {
  it('should infer webpack5 info from builder', () => {
    expect(
      getBuilderInfo({
        core: { builder: '@storybook/builder-webpack5' },
      })
    ).toEqual({ name: 'webpack5', options: {} });

    expect(
      getBuilderInfo({
        core: {
          builder: {
            name: '@storybook/builder-webpack5',
            options: { lazyCompilation: true },
          },
        },
      })
    ).toEqual({
      name: 'webpack5',
      options: { lazyCompilation: true },
    });
  });

  it('should infer webpack5 info from framework', () => {
    expect(
      getBuilderInfo({
        framework: '@storybook/react-webpack5',
      })
    ).toEqual({ name: 'webpack5', options: {} });

    expect(
      getBuilderInfo({
        framework: {
          name: '@storybook/react-webpack5',
          options: {
            builder: {
              lazyCompilation: true,
            },
          },
        },
      })
    ).toEqual({
      name: 'webpack5',
      options: { lazyCompilation: true },
    });
  });

  it('should infer vite info from builder', () => {
    expect(
      getBuilderInfo({
        core: { builder: '@storybook/builder-vite' },
      })
    ).toEqual({ name: 'vite', options: {} });

    expect(
      getBuilderInfo({
        core: {
          builder: {
            name: '@storybook/builder-vite',
            options: { foo: 'bar' },
          },
        },
      })
    ).toEqual({
      name: 'vite',
      options: { foo: 'bar' },
    });
  });

  it('should infer vite info from framework', () => {
    expect(
      getBuilderInfo({
        framework: '@storybook/react-vite',
      })
    ).toEqual({ name: 'vite', options: {} });

    expect(
      getBuilderInfo({
        framework: {
          name: '@storybook/react-vite',
          options: { builder: { foo: 'bar' } },
        },
      })
    ).toEqual({
      name: 'vite',
      options: { foo: 'bar' },
    });
  });
});

describe('getNextjsAddonOptions', () => {
  it('should find storybook-addon-next and extract its options', () => {
    expect(getNextjsAddonOptions(['foo', 'bar'])).toEqual({});
    expect(getNextjsAddonOptions(['foo', 'storybook-addon-next'])).toEqual({});
    expect(getNextjsAddonOptions(['foo', { name: 'storybook-addon-next' }])).toEqual({});
    expect(getNextjsAddonOptions(['foo', { name: 'storybook-addon-next', options: {} }])).toEqual(
      {}
    );
    expect(
      getNextjsAddonOptions([
        'foo',
        {
          name: 'storybook-addon-next',
          options: {
            nextConfigPath: 'foo/bar',
          },
        },
      ])
    ).toEqual({ nextConfigPath: 'foo/bar' });
  });
});

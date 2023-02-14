import { getBuilderInfo as _getBuilderInfo } from './utils';

type GetBuilderInfoParams = Parameters<typeof _getBuilderInfo>[0];

const getBuilderInfo = (mainConfig: Partial<GetBuilderInfoParams>) =>
  _getBuilderInfo(mainConfig as GetBuilderInfoParams);

describe('getBuilderInfo', () => {
  it('should infer webpack5 info from builder', () => {
    expect(
      getBuilderInfo({
        core: { builder: '@storybook/builder-webpack5' },
      })
    ).toEqual({
      name: 'webpack5',
      options: {},
    });

    expect(
      getBuilderInfo({
        core: {
          builder: {
            name: '@storybook/builder-webpack5',
            options: {
              lazyCompilation: true,
            },
          },
        },
      })
    ).toEqual({
      name: 'webpack5',
      options: {
        lazyCompilation: true,
      },
    });
  });

  it('should infer webpack5 info from framework', () => {
    expect(
      getBuilderInfo({
        framework: '@storybook/react-webpack5',
      })
    ).toEqual({
      name: 'webpack5',
      options: {},
    });

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
      options: {
        lazyCompilation: true,
      },
    });
  });

  it('should infer vite info from builder', () => {
    expect(
      getBuilderInfo({
        core: { builder: '@storybook/builder-vite' },
      })
    ).toEqual({
      name: 'vite',
      options: {},
    });

    expect(
      getBuilderInfo({
        core: {
          builder: {
            name: '@storybook/builder-vite',
            options: {
              foo: 'bar',
            },
          },
        },
      })
    ).toEqual({
      name: 'vite',
      options: {
        foo: 'bar',
      },
    });
  });

  it('should infer vite info from framework', () => {
    expect(
      getBuilderInfo({
        framework: '@storybook/react-vite',
      })
    ).toEqual({
      name: 'vite',
      options: {},
    });

    expect(
      getBuilderInfo({
        framework: {
          name: '@storybook/react-vite',
          options: {
            builder: {
              foo: 'bar',
            },
          },
        },
      })
    ).toEqual({
      name: 'vite',
      options: {
        foo: 'bar',
      },
    });
  });
});

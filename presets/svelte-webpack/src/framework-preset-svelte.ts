import type { StorybookConfig } from '@storybook/core-webpack';

export const webpack: StorybookConfig['webpack'] = async (config, options) => {
  const { preprocess = undefined, loader = {} } = await options.presets.apply(
    'svelteOptions',
    {} as any,
    options
  );

  const mainFields = (config.resolve.mainFields as string[]) || ['browser', 'module', 'main'];

  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.(svelte|html)$/,
          loader: require.resolve('svelte-loader'),
          options: { preprocess, ...loader },
        },
      ],
    },
    resolve: {
      ...config.resolve,
      extensions: [...config.resolve.extensions, '.svelte'],
      alias: config.resolve.alias,
      mainFields: ['svelte', ...mainFields],
    },
  };
};

export const babelDefault: StorybookConfig['babelDefault'] = (config) => {
  return {
    ...config,
    presets: [...(config?.presets || [])],
    plugins: [...(config?.plugins || [])],
  };
};

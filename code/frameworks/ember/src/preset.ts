import { dirname, join } from 'path';
import type { PresetProperty } from '@storybook/types';
import { getVirtualModules } from '@storybook/builder-webpack5';
import { getProjectRoot, resolvePathInStorybookCache } from '@storybook/core-common';
import type { StorybookConfig } from './types';

const getAbsolutePath = <I extends string>(input: I): I =>
  dirname(require.resolve(join(input, 'package.json'))) as any;

export const addons: PresetProperty<'addons'> = [
  require.resolve('./server/framework-preset-babel-ember'),
  require.resolve('./server/framework-preset-ember-docs'),
];

export const webpackFinal: StorybookConfig['webpackFinal'] = async (baseConfig, options) => {
  const { virtualModules } = await getVirtualModules(options);

  const babelOptions = await options.presets.apply('babel', {}, options);
  const typescriptOptions = await options.presets.apply('typescript', {}, options);

  return {
    ...baseConfig,
    resolve: {
      ...baseConfig.resolve,
      alias: {
        ...baseConfig.resolve?.alias,

        // Packages
        ember: 'ember-source/dist/packages/ember',
        '@ember': 'ember-source/dist/packages/@ember',

        // Dependencies
        '@glimmer': 'ember-source/dist/dependencies/@glimmer',
        '@simple-dom': 'ember-source/dist/dependencies/@simple-dom',
        'backburner.js': 'ember-source/dist/dependencies/backburner.js',
        'rsvp.js': 'ember-source/dist/dependencies/rsvp',
      },
    },
    module: {
      ...baseConfig.module,
      rules: [
        ...(baseConfig.module?.rules ?? []),
        {
          test: typescriptOptions.skipCompiler ? /\.((c|m)?jsx?)$/ : /\.((c|m)?(j|t)sx?)$/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                cacheDirectory: resolvePathInStorybookCache('babel'),
                ...babelOptions,
              },
            },
          ],
          include: [getProjectRoot()],
          exclude: [/node_modules\/(?!.*ember.*)/, ...Object.keys(virtualModules)],
        },
      ],
    },
  };
};

export const core: PresetProperty<'core'> = async (config, options) => {
  const framework = await options.presets.apply('framework');

  return {
    ...config,
    builder: {
      name: getAbsolutePath('@storybook/builder-webpack5'),
      options: typeof framework === 'string' ? {} : framework.options.builder || {},
    },
  };
};

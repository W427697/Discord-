/* eslint-disable no-param-reassign */

import PnpWebpackPlugin from 'pnp-webpack-plugin';
import { logger } from '@storybook/node-logger';
import { dirname, join, relative } from 'path';
import type { PresetProperty, Options } from '@storybook/core-common';
import type { Configuration, ResolvePluginInstance, RuleSetRule } from 'webpack';
import type { FrameworkOptions, StorybookConfig } from './types';
import { getCRAPath } from './utils/getCRAPath';
import { testMatch } from './utils/testMatch';
import { checkForIncompatiblePresets } from './utils/compatibility';
import { filterCRAPlugins, filterStorybookRules } from './utils/webpack';
import { defaultFrameworkOptions } from './utils/options';

export const addons: PresetProperty<'addons', StorybookConfig> = [
  dirname(require.resolve(join('@storybook/preset-react-webpack', 'package.json'))),
  dirname(require.resolve(join('@storybook/react', 'package.json'))),
  dirname(require.resolve(join('@storybook/builder-webpack5', 'package.json'))),
];

export const frameworkOptions = async (
  _: never,
  options: Options
): Promise<StorybookConfig['framework']> => {
  const config = await options.presets.apply<StorybookConfig['framework']>('framework');

  if (typeof config === 'string') {
    return {
      name: config,
      options: defaultFrameworkOptions,
    };
  }
  if (typeof config === 'undefined') {
    return {
      name: require.resolve('@storybook/cra') as '@storybook/cra',
      options: defaultFrameworkOptions,
    };
  }

  return {
    name: config.name,
    options: {
      ...defaultFrameworkOptions,
      ...config.options,
    },
  };
};

export const core: PresetProperty<'core', StorybookConfig> = async (config, options) => {
  const framework = await options.presets.apply<StorybookConfig['framework']>('framework');

  return {
    ...config,
    builder: {
      name: dirname(
        require.resolve(join('@storybook/builder-webpack5', 'package.json'))
      ) as '@storybook/builder-webpack5',
      options: typeof framework === 'string' ? {} : framework.options.builder || {},
    },
  };
};

export const webpack: StorybookConfig['webpack'] = async (config, options) => {
  config.resolve = config.resolve || {};
  config.module = config.module || {};
  config.module.rules = config.module.rules || [];

  checkForIncompatiblePresets(options);

  const { presets, configDir } = options;
  const frameworkOptions = await presets.apply<FrameworkOptions>('frameworkOptions');

  const CRAPath = await getCRAPath(frameworkOptions.scriptsPackageName, options);
  const CWDPath = process.cwd();
  const CRAConfigPath = join(CRAPath, 'config', 'webpack.config');

  logger.info(`=> Loading Webpack configuration from '${relative(CWDPath, CRAConfigPath)}'`);

  // eslint-disable-next-line import/no-dynamic-require, global-require
  const craWebpackConfig: Configuration = require(CRAConfigPath)(config.mode);

  config.module.rules = [
    ...(config.module.rules as unknown as RuleSetRule[]).filter(filterStorybookRules),
    ...((craWebpackConfig?.module?.rules || []) as unknown as RuleSetRule[]).map((r) => {
      if (r.oneOf) {
        return {
          oneOf: r.oneOf.reduce<RuleSetRule[]>((acc, item) => {
            if (testMatch(item, '.js')) {
              item.include = ([] as any[]).concat(item.include || []).concat(configDir);
            }
            if (testMatch(item, '.css')) {
              item.include = ([] as any[]).concat(item.include || []).concat(configDir);
            }
            if (item.type === 'asset/resource') {
              const excludes = [
                'ejs', // Used within Storybook.
                'md', // Used with Storybook Notes.
                'mdx', // Used with Storybook Docs.
                'cjs', // Used for CommonJS modules.
                ...(frameworkOptions.fileLoaderExcludes || []),
              ];
              const excludeRegex = new RegExp(`\\.(${excludes.join('|')})$`);

              item.exclude = ([] as any[]).concat(item.exclude || []).concat(excludeRegex);
            }
            if (testMatch(item, '.ejs')) {
              // skip this
              return acc;
            }
            acc.push(item);
            return acc;
          }, []),
        };
      }
      return r;
    }),
  ];

  config.plugins = [
    ...(config.plugins || []),
    ...(craWebpackConfig?.plugins || []).filter(filterCRAPlugins),
  ];

  config.resolve = {
    ...config.resolve,
    ...craWebpackConfig?.resolve,
    plugins: [
      ...(config.resolve?.plugins || []),
      ...(craWebpackConfig?.resolve?.plugins || []),
      PnpWebpackPlugin as unknown as ResolvePluginInstance,
    ],
    alias: {
      ...config.resolve?.alias,
      ...craWebpackConfig?.resolve?.alias,
      '@storybook/react': dirname(require.resolve(join('@storybook/react', 'package.json'))),
    },
  };

  config.resolveLoader = {
    modules: ['node_modules', join(CRAPath, 'node_modules')],
    plugins: [PnpWebpackPlugin.moduleLoader(module)],
  };

  return config;
};

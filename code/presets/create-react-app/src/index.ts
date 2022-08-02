/// <reference types="node" />

import type { StorybookConfig } from '@storybook/core-webpack';

import { join, relative, dirname } from 'path';
import type { Options } from '@storybook/core-common';
import { Configuration, RuleSetRule } from 'webpack'; // eslint-disable-line import/no-extraneous-dependencies
import semver from 'semver';
import { logger } from '@storybook/node-logger';
// @ts-ignore
import PnpWebpackPlugin from 'pnp-webpack-plugin';
import ReactDocgenTypescriptPlugin from '@storybook/react-docgen-typescript-plugin';
import { mergePlugins } from './helpers/mergePlugins';
import { getReactScriptsPath } from './helpers/getReactScriptsPath';
import { processCraConfig } from './helpers/processCraConfig';
import { checkPresets } from './helpers/checkPresets';
import { getModulePath } from './helpers/getModulePath';
import { PluginOptions } from './types';

const CWD = process.cwd();
const REACT_SCRIPTS_PATH = getReactScriptsPath();
const OPTION_SCRIPTS_PACKAGE = 'scriptsPackageName';

// Ensures that assets are served from the correct path when Storybook is built.
// Resolves: https://github.com/storybookjs/storybook/issues/4645
if (!process.env.PUBLIC_URL) {
  process.env.PUBLIC_URL = '.';
}

// Don't use Storybook's default Babel config.
export const babelDefault = () => ({
  presets: [],
  plugins: [],
});

// Update the core Webpack config.
export const webpack: StorybookConfig['webpack'] = async (inputConfig = {}, inputOptions) => {
  // We go though this, because of typing issues
  // I got:
  // 'ErrorObject' is not exported by '../../node_modules/schema-utils/node_modules/ajv/lib/ajv.d.ts'
  // and I didn't know how to fix it. Given this module is never actually 'referenced' and should only be used in cra anyway, it's fine if types are not correct.

  const webpackConfig = inputConfig as Configuration;
  const options = inputOptions as Options & PluginOptions;

  let scriptsPath = REACT_SCRIPTS_PATH;

  // Flag any potentially conflicting presets.
  checkPresets(options);

  // If the user has provided a package by name, try to resolve it.
  const scriptsPackageName = options[OPTION_SCRIPTS_PACKAGE];
  if (typeof scriptsPackageName === 'string') {
    try {
      scriptsPath = dirname(
        require.resolve(`${scriptsPackageName}/package.json`, {
          paths: [options.configDir],
        })
      );
    } catch (e) {
      logger.warn(`A \`${OPTION_SCRIPTS_PACKAGE}\` was provided, but couldn't be resolved.`);
    }
  }

  // If there isn't a scripts-path set, return the Webpack config unmodified.
  if (!scriptsPath) {
    logger.error('Failed to resolve a `react-scripts` package.');
    return webpackConfig;
  }

  logger.info(`=> Loading Webpack configuration from \`${relative(CWD, scriptsPath)}\``);

  // Remove existing rules related to JavaScript and TypeScript.
  logger.info(`=> Removing existing JavaScript and TypeScript rules.`);
  const unfilteredRules = (webpackConfig.module?.rules || []) as unknown as RuleSetRule[];
  const filteredRules =
    unfilteredRules.filter(
      ({ test }) =>
        !(test instanceof RegExp && (test.test('.js') || test.test('.ts') || test.test('.css')))
    ) || [];

  // Require the CRA config and set the appropriate mode.
  const craWebpackConfigPath = join(scriptsPath, 'config', 'webpack.config');
  // eslint-disable-next-line global-require, import/no-dynamic-require, @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-call
  const craWebpackConfig = require(craWebpackConfigPath)(webpackConfig.mode) as Configuration;

  // Select the relevant CRA rules and add the Storybook config directory.
  logger.info(`=> Modifying Create React App rules.`);
  const craRules = processCraConfig(craWebpackConfig, options);

  // NOTE: These are set by default in Storybook 6.
  const isStorybook6 = semver.gte(options.packageJson.version || '', '6.0.0');
  const {
    typescriptOptions = {
      reactDocgen: 'react-docgen-typescript',
      reactDocgenTypescriptOptions: {},
    },
  } = options;
  const tsDocgenPlugin =
    !isStorybook6 && typescriptOptions.reactDocgen === 'react-docgen-typescript'
      ? [new ReactDocgenTypescriptPlugin(typescriptOptions.reactDocgenTypescriptOptions)]
      : [];

  // NOTE: This is code replicated from
  //   https://github.com/storybookjs/storybook/blob/89830ad76384faeaeb0c19df3cb44232cdde261b/lib/builder-webpack5/src/preview/base-webpack.config.ts#L45-L53
  // as we are not applying SB's default webpack config here.
  // We need to figure out a better way to apply various layers of webpack config; perhaps
  // these options need to be in a separate preset.
  const isProd = webpackConfig.mode !== 'development';
  const coreOptions = await options.presets.apply('core');
  const builder = coreOptions?.builder;
  const builderOptions = !builder || typeof builder === 'string' ? {} : builder.options;
  const cacheConfig = builderOptions?.fsCache ? { cache: { type: 'filesystem' } } : {};
  const lazyCompilationConfig =
    builderOptions?.lazyCompilation && !isProd
      ? { experiments: { lazyCompilation: { entries: false } } }
      : {};

  // Return the new config.
  return {
    ...webpackConfig,
    ...cacheConfig,
    ...lazyCompilationConfig,
    module: {
      ...webpackConfig.module,
      rules: [
        ...filteredRules,
        ...craRules,
        {
          test: /\.m?js$/,
          type: 'javascript/auto',
        },
        {
          test: /\.m?js$/,
          resolve: {
            fullySpecified: false,
          },
        },
      ],
    },
    // NOTE: this prioritizes the storybook version of a plugin
    // when there are duplicates between SB and CRA
    plugins: mergePlugins(
      ...(webpackConfig.plugins || []),
      ...(craWebpackConfig.plugins ?? []),
      ...tsDocgenPlugin
    ),
    resolve: {
      ...webpackConfig.resolve,
      extensions: craWebpackConfig.resolve?.extensions,
      modules: [
        ...((webpackConfig.resolve && webpackConfig.resolve.modules) || []),
        join(REACT_SCRIPTS_PATH, 'node_modules'),
        ...getModulePath(CWD),
      ],
      plugins: [PnpWebpackPlugin],
    },
    resolveLoader: {
      modules: ['node_modules', join(REACT_SCRIPTS_PATH, 'node_modules')],
      plugins: [PnpWebpackPlugin.moduleLoader(module)],
    },
  } as Configuration;
};

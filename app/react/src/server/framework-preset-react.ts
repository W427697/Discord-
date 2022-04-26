import path from 'path';
import { TransformOptions } from '@babel/core';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import type { Configuration } from 'webpack';

import { logger } from '@storybook/node-logger';
import type { Options, Preset } from '@storybook/core-common';
import type { ReactOptions } from '../types';

const useFastRefresh = async (options: Options) => {
  const isDevelopment = options.configType === 'DEVELOPMENT';
  const framework = await options.presets.apply<Preset>('framework');
  const reactOptions = (typeof framework === 'object' ? framework.options : {}) as ReactOptions;
  return isDevelopment && (reactOptions.fastRefresh || process.env.FAST_REFRESH === 'true');
};

export async function babel(config: TransformOptions, options: Options) {
  if (!(await useFastRefresh(options))) return config;

  return {
    ...config,
    plugins: [
      [require.resolve('react-refresh/babel'), {}, 'storybook-react-refresh'],
      ...(config.plugins || []),
    ],
  };
}
const storybookReactDirName = path.dirname(require.resolve('@storybook/react/package.json'));
// TODO: improve node_modules detection
const context = storybookReactDirName.includes('node_modules')
  ? path.join(storybookReactDirName, '../../') // Real life case, already in node_modules
  : path.join(storybookReactDirName, '../../node_modules'); // SB Monorepo

const hasJsxRuntime = () => {
  try {
    require.resolve('react/jsx-runtime', { paths: [context] });
    return true;
  } catch (e) {
    return false;
  }
};

export async function babelDefault(config: TransformOptions): Promise<TransformOptions> {
  const presetReactOptions = hasJsxRuntime() ? { runtime: 'automatic' } : {};
  return {
    ...config,
    presets: [
      ...(config?.presets || []),
      [require.resolve('@babel/preset-react'), presetReactOptions],
      require.resolve('@babel/preset-flow'),
    ],
    plugins: [...(config?.plugins || []), require.resolve('babel-plugin-add-react-displayname')],
  };
}

export async function webpackFinal(config: Configuration, options: Options) {
  if (!(await useFastRefresh(options))) return config;

  // matches the name of the plugin in CRA.
  const hasReactRefresh = config.plugins.find((p) => p.constructor.name === 'ReactRefreshPlugin');

  if (hasReactRefresh) {
    logger.warn("=> React refresh is already set. You don't need to set the option");
    return config;
  }

  logger.info('=> Using React fast refresh');

  return {
    ...config,
    plugins: [
      ...config.plugins,

      // Storybook uses webpack-hot-middleware https://github.com/storybookjs/storybook/issues/14114
      new ReactRefreshWebpackPlugin({
        overlay: {
          sockIntegration: 'whm',
        },
      }),
    ],
  };
}

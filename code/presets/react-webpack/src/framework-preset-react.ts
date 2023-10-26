import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

import { logger } from '@storybook/node-logger';

import type { Options, Preset } from '@storybook/core-webpack';
import type { StorybookConfig, ReactOptions } from './types';

// TODO: Use it also for setting the correct swc option for development and refresh
const applyFastRefresh = async (options: Options) => {
  const isDevelopment = options.configType === 'DEVELOPMENT';
  const framework = await options.presets.apply<Preset>('framework');
  const reactOptions = (typeof framework === 'object' ? framework.options : {}) as ReactOptions;
  return isDevelopment && (reactOptions.fastRefresh || process.env.FAST_REFRESH === 'true');
};

export const webpackFinal: StorybookConfig['webpackFinal'] = async (config, options) => {
  if (!(await applyFastRefresh(options))) return config;
  // matches the name of the plugin in CRA.
  const hasReactRefresh = !!config.plugins?.find(
    (p) => p.constructor.name === 'ReactRefreshPlugin'
  );

  if (hasReactRefresh) {
    logger.warn("=> React refresh is already set. You don't need to set the option");
    return config;
  }

  logger.info('=> Using React fast refresh');

  return {
    ...config,
    plugins: [
      ...(config.plugins || []),

      // Storybook uses webpack-hot-middleware https://github.com/storybookjs/storybook/issues/14114
      new ReactRefreshWebpackPlugin({
        overlay: {
          sockIntegration: 'whm',
        },
      }),
    ],
  };
};

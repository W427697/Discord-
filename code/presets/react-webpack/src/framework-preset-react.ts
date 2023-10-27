import { logger } from '@storybook/node-logger';

import type { Options, Preset } from '@storybook/core-webpack';
import type { StorybookConfig, ReactOptions } from './types';

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

  try {
    return {
      ...config,
      plugins: [
        ...(config.plugins || []),

        // Storybook uses webpack-hot-middleware https://github.com/storybookjs/storybook/issues/14114
        new (await import('@pmmmwh/react-refresh-webpack-plugin')).ReactRefreshPlugin({
          overlay: {
            sockIntegration: 'whm',
          },
        }),
      ],
    };
  } catch (e) {
    logger.error(
      '=> You have activated fast refresh! "react-refresh" or "@pmmmwh/react-refresh-webpack-plugin" is not installed. Please install them to make it work.'
    );
    return config;
  }
};

export const babel: StorybookConfig['babel'] = async (config, options) => {
  if (!(await applyFastRefresh(options))) return config;

  let reactRefreshPlugin: string | undefined;

  try {
    reactRefreshPlugin = require.resolve('react-refresh/babel');
  } catch (e) {
    logger.error(
      '=> You have activated fast refresh! react-refresh is not installed, please install it to make it work.'
    );
  }

  const plugins = reactRefreshPlugin
    ? [[reactRefreshPlugin, {}, 'storybook-react-refresh'], ...(config.plugins || [])]
    : config.plugins;

  return {
    ...config,
    plugins,
  };
};

export const swc: StorybookConfig['swc'] = async (config, options) => {
  const isDevelopment = options.configType !== 'PRODUCTION';

  if (!(await applyFastRefresh(options))) {
    return config;
  }

  return {
    ...config,
    jsc: {
      ...(config?.jsc ?? {}),
      transform: {
        ...(config?.jsc?.transform ?? {}),
        react: {
          ...(config?.jsc?.transform?.react ?? {}),
          development: isDevelopment,
          refresh: isDevelopment,
        },
      },
    },
  };
};

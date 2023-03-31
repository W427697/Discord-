/* eslint-disable no-param-reassign */
import { dirname, join } from 'path';
import { logger } from '@storybook/node-logger';

import type { Options, Preset } from '@storybook/core-rspack';
import type { StorybookConfig, ReactOptions } from './types';

const wrapForPnP = (input: string) => dirname(require.resolve(join(input, 'package.json')));

const applyFastRefresh = async (options: Options) => {
  const isDevelopment = options.configType === 'DEVELOPMENT';
  const framework = await options.presets.apply<Preset>('framework');
  const reactOptions = (typeof framework === 'object' ? framework.options : {}) as ReactOptions;
  return isDevelopment && (reactOptions.fastRefresh || process.env.FAST_REFRESH === 'true');
};

const storybookReactDirName = wrapForPnP('@storybook/preset-react-rspack');
// TODO: improve node_modules detection
const context = storybookReactDirName.includes('node_modules')
  ? join(storybookReactDirName, '../../') // Real life case, already in node_modules
  : join(storybookReactDirName, '../../node_modules'); // SB Monorepo

const hasJsxRuntime = () => {
  try {
    require.resolve('react/jsx-runtime', { paths: [context] });
    return true;
  } catch (e) {
    return false;
  }
};

export const rspackFinal: StorybookConfig['rspackFinal'] = async (config, options) => {
  config.builtins ??= {};
  // eslint-disable-next-line no-multi-assign
  const reactConfig = (config.builtins.react ??= {});

  if (hasJsxRuntime()) {
    reactConfig.runtime = 'automatic';
  } else {
    reactConfig.runtime = 'classic';
  }

  // This only used for storybook workspace example,
  // Remove this when loadUserRspackConfig is done
  config.resolve ??= {};
  config.resolve.alias = {
    ...config.resolve.alias,
    react: require.resolve('react'),
  };

  if (!(await applyFastRefresh(options))) return config;

  reactConfig.development = true;
  reactConfig.refresh = true;

  logger.info('=> Using React fast refresh');

  return config;
};

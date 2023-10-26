// https://storybook.js.org/docs/react/addons/writing-presets
import { dirname, join } from 'path';
import type { Options, PresetProperty } from '@storybook/types';

import * as webpack from 'next/dist/compiled/webpack/webpack';
import { configureConfig } from './config/webpack';
import { configureCss } from './css/webpack';
import { configureImports } from './imports/webpack';
import { configureStyledJsx } from './styledJsx/webpack';
import { configureImages } from './images/webpack';
import { configureRuntimeNextjsVersionResolution } from './utils';
import type { FrameworkOptions, StorybookConfig } from './types';
import { configureNextImport } from './nextImport/webpack';
import { configureNextFont } from './font/webpack/configureNextFont';
import { configureNodePolyfills } from './nodePolyfills/webpack';
import { configureAliasing } from './dependency-map';
import { configureSWCLoader } from './swc/loader';

export const addons: PresetProperty<'addons', StorybookConfig> = [
  dirname(require.resolve(join('@storybook/preset-react-webpack', 'package.json'))),
  dirname(require.resolve(join('@storybook/builder-webpack5', 'package.json'))),
];

const defaultFrameworkOptions: FrameworkOptions = {};

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
      name: require.resolve('@storybook/nextjs') as '@storybook/nextjs',
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
      options: {
        useSWC: false,
        ...(typeof framework === 'string' ? {} : framework.options.builder || {}),
      },
    },
    renderer: dirname(require.resolve(join('@storybook/react', 'package.json'))),
  };
};

export const previewAnnotations: StorybookConfig['previewAnnotations'] = (entry = []) => [
  ...entry,
  require.resolve('@storybook/nextjs/preview.js'),
];

// export const webpackInstance = async () => {
//   webpack.init();
//   return webpack;
// };

export const webpackFinal: StorybookConfig['webpackFinal'] = async (baseConfig, options) => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const frameworkOptions = await options.presets.apply<{ options: FrameworkOptions }>(
    'frameworkOptions'
  );
  const { options: { nextConfigPath } = {} } = frameworkOptions;
  const nextConfig = await configureConfig({
    baseConfig,
    nextConfigPath,
    configDir: options.configDir,
  });

  configureAliasing(baseConfig);
  configureNextFont(baseConfig);
  configureNextImport(baseConfig);
  configureRuntimeNextjsVersionResolution(baseConfig);
  configureImports({ baseConfig, configDir: options.configDir });
  configureCss(baseConfig, nextConfig);
  configureImages(baseConfig, nextConfig);
  configureStyledJsx(baseConfig);
  configureNodePolyfills(baseConfig);
  configureSWCLoader(baseConfig, options, nextConfig);

  return baseConfig;
};

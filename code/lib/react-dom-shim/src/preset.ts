import type { Options, StorybookConfig } from '@storybook/types';
import { version } from 'react-dom/package.json';

// @ts-expect-error can't use webpack-inclusive config type
export const webpackFinal: StorybookConfig['webpackFinal'] = async (
  config: any,
  options: Options
) => {
  const { legacyRootApi } = await options.presets.apply<{ legacyRootApi?: boolean }>(
    'frameworkOptions'
  );

  const isReact18 = version.startsWith('18') || version.startsWith('0.0.0');
  const useReact17 = legacyRootApi ?? !isReact18;
  if (useReact17) return config;

  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        '@storybook/react-dom-shim': '@storybook/react-dom-shim/react-18',
      },
    },
  };
};

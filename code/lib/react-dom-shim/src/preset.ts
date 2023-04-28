import type { Options } from '@junk-temporary-prototypes/types';
// @ts-expect-error react-dom doesn't have this in export maps in v16, messing up TS
import { version } from 'react-dom/package.json';

export const webpackFinal = async (config: any, options: Options) => {
  const { legacyRootApi } =
    (await options.presets.apply<{ legacyRootApi?: boolean } | null>('frameworkOptions')) || {};

  const isReact18 = version.startsWith('18') || version.startsWith('0.0.0');
  const useReact17 = legacyRootApi ?? !isReact18;
  if (useReact17) return config;

  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@junk-temporary-prototypes/react-dom-shim': '@junk-temporary-prototypes/react-dom-shim/dist/react-18',
      },
    },
  };
};

export const viteFinal = async (config: any, options: Options) => {
  const { legacyRootApi } =
    (await options.presets.apply<{ legacyRootApi?: boolean } | null>('frameworkOptions')) || {};

  const isReact18 = version.startsWith('18') || version.startsWith('0.0.0');
  const useReact17 = legacyRootApi || !isReact18;
  if (useReact17) return config;

  const alias = Array.isArray(config.resolve?.alias)
    ? config.resolve.alias.concat({
        find: /^@junk-temporary-prototypes\/react-dom-shim$/,
        replacement: '@junk-temporary-prototypes/react-dom-shim/dist/react-18',
      })
    : {
        ...config.resolve?.alias,
        '@junk-temporary-prototypes/react-dom-shim': '@junk-temporary-prototypes/react-dom-shim/dist/react-18',
      };

  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias,
    },
  };
};

import type { Configuration as WebpackConfig } from 'webpack';
import semver from 'semver';
import { getNextjsVersion, addScopedAlias } from './utils';

// Utility to assist in aliasing modules based on the version of Next.js
// This allows us to support multiple versions of Next.js with a single Storybook configuration
const mapping: Record<string, Record<string, string>> = {
  '>14.2.0': {
    '@storybook/nextjs/dist/routing/path-params-provider':
      '@storybook/nextjs/dist/routing/path-params-provider-mock',
  },
};

export const configureAliasing = (baseConfig: WebpackConfig): void => {
  const version = getNextjsVersion();
  const result: Record<string, string> = {};

  Object.keys(mapping).forEach((key) => {
    if (semver.intersects(version, key)) {
      Object.assign(result, mapping[key]);
    }
  });

  Object.entries(result).forEach(([name, alias]) => {
    addScopedAlias(baseConfig, name, alias);
  });
};

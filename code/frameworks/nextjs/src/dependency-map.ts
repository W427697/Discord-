import type { Configuration as WebpackConfig } from 'webpack';
import semver from 'semver';
import { getNextjsVersion, addScopedAlias } from './utils';

const mapping = {
  default: {
    'next/dist/shared/lib/router-context': 'next/dist/next-server/lib/router-context',
    'next/dist/shared/lib/head-manager-context': 'next/dist/shared/lib/head-manager-context',
    'next/dist/shared/lib/app-router-context': 'next/dist/shared/lib/app-router-context',
    'next/dist/shared/lib/hooks-client-context': 'next/dist/shared/lib/hooks-client-context',
  },
  '11.1.0': {
    'next/dist/shared/lib/router-context': 'next/dist/shared/lib/router-context',
    'next/dist/shared/lib/head-manager-context': 'next/dist/shared/lib/head-manager-context',
    'next/dist/shared/lib/app-router-context': 'next/dist/shared/lib/app-router-context',
    'next/dist/shared/lib/hooks-client-context': 'next/dist/shared/lib/hooks-client-context',
  },
  '13.5.1': {
    'next/dist/shared/lib/router-context': 'next/dist/shared/lib/router-context.shared-runtime',
    'next/dist/shared/lib/head-manager-context':
      'next/dist/shared/lib/head-manager-context.shared-runtime',
    'next/dist/shared/lib/app-router-context':
      'next/dist/shared/lib/app-router-context.shared-runtime',
    'next/dist/shared/lib/hooks-client-context':
      'next/dist/shared/lib/hooks-client-context.shared-runtime',
  },
};

export const configureAliasing = (baseConfig: WebpackConfig): void => {
  const version = getNextjsVersion();
  const result: Record<string, string> = { ...mapping.default };

  if (semver.gte(version, '13.5.1')) {
    Object.assign(result, mapping['13.5.1']);
  }

  Object.entries(result).forEach(([name, alias]) => {
    addScopedAlias(baseConfig, name, alias);
  });
};

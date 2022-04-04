import path from 'path';
import type { TransformOptions } from '@babel/core';
import type { Configuration } from 'webpack';
import type { StorybookConfig } from '@storybook/core-common';
import { findDistEsm } from '@storybook/core-common';
import semverRegex from 'semver-regex';

function isPreactX() {
  const preactPackage = require('preact/package.json');
  const version = preactPackage.version.match(semverRegex())[0];
  const major = parseFloat(version.split('.')[0]);
  return major >= 10;
}

export function babelDefault(config: TransformOptions): TransformOptions {
  return {
    ...config,
    plugins: [
      ...config.plugins,
      [require.resolve('@babel/plugin-transform-react-jsx'), { pragma: 'h' }, 'preset'],
    ],
  };
}

export function webpackFinal(config: Configuration): Configuration {
  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        react: path.dirname(
          require.resolve(isPreactX() ? 'preact/compat/package.json' : 'preact-compat/package.json')
        ),
        ...(isPreactX() && {
          'react-dom/test-utils': path.dirname(require.resolve('preact/test-utils/package.json')),
        }),
        'react-dom': path.dirname(
          require.resolve(isPreactX() ? 'preact/compat/package.json' : 'preact-compat/package.json')
        ),
      },
    },
  };
}

export const previewAnnotations: StorybookConfig['previewAnnotations'] = (entry = []) => {
  return [...entry, findDistEsm(__dirname, 'client/preview/config')];
};

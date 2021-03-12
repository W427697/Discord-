import { TransformOptions } from '@babel/core';

const plugins = [
  require.resolve('@babel/plugin-transform-shorthand-properties'),
  require.resolve('@babel/plugin-transform-block-scoping'),
  require.resolve('@babel/plugin-proposal-class-properties'),
  require.resolve('@babel/plugin-proposal-private-methods'),
  require.resolve('@babel/plugin-proposal-export-default-from'),
  require.resolve('@babel/plugin-syntax-dynamic-import'),
  [require.resolve('@babel/plugin-proposal-object-rest-spread'), { useBuiltIns: true }],
  require.resolve('@babel/plugin-transform-classes'),
  require.resolve('@babel/plugin-transform-arrow-functions'),
  require.resolve('@babel/plugin-transform-parameters'),
  require.resolve('@babel/plugin-transform-destructuring'),
  require.resolve('@babel/plugin-transform-spread'),
  require.resolve('@babel/plugin-transform-for-of'),
  require.resolve('babel-plugin-macros'),
  [
    require.resolve('babel-plugin-polyfill-corejs3'),
    {
      method: 'usage-global',
      absoluteImports: require.resolve('core-js'),
      // eslint-disable-next-line global-require
      version: require('core-js/package.json').version,
    },
  ],
];

const presets = [
  [require.resolve('@babel/preset-env'), { shippedProposals: true, modules: false }],
  require.resolve('@babel/preset-typescript'),
];

export const babelConfig: () => TransformOptions = () => {
  return {
    sourceType: 'unambiguous',
    assumptions: {
      noClassCalls: true,
      constantReexports: true,
      constantSuper: true,
      ignoreFunctionLength: true,
      ignoreToPrimitiveHint: true,
      privateFieldsAsProperties: true,
      setSpreadProperties: true,
      pureGetters: true,
      setPublicClassFields: true,
    },
    presets: [...presets],
    plugins: [...plugins],
  };
};

import { checkModules, buildIncludeRegexp } from 'are-you-es5';
import { logger } from '@storybook/node-logger';
import { plugins } from './babel';

const es6Transpiler = () => {
  const result = checkModules({
    path: '', // Automatically find up package.json from cwd
    checkAllNodeModules: true,
    ignoreBabelAndWebpackPackages: true,
  });

  const include = buildIncludeRegexp(result.es6Modules);
  logger.info('Using es6 transpiler with regexp', include);
  return {
    test: /\.js$/,
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          sourceType: 'unambiguous',
          presets: [
            [
              require.resolve('@babel/preset-env'),
              { shippedProposals: true, useBuiltIns: 'usage', corejs: '3' },
            ],
            require.resolve('@babel/preset-react'),
          ],
          plugins,
        },
      },
    ],
    include,
  };
};

export default es6Transpiler;

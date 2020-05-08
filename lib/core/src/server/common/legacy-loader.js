// Run npx are-you-es5 check lib/core -r
// to get this regexp

const regexp = /[\\/]node_modules[\\/](?!(@storybook\/node-logger|are-you-es5|better-opn|boxen|chalk|commander|find-cache-dir|find-up|fs-extra|json5|node-fetch|pkg-dir|resolve-from|semver)[\\/])/;

export default {
  test: /\.(mjs|tsx?|jsx?)$/,
  use: [
    {
      loader: require.resolve('babel-loader'),
      options: {
        sourceType: 'unambiguous',
        presets: [
          [
            require.resolve('@babel/preset-env'),
            {
              shippedProposals: true,
              useBuiltIns: 'usage',
              corejs: '3',
            },
          ],
          require.resolve('@babel/preset-typescript'),
          require.resolve('@babel/preset-react'),
        ],
        plugins: [
          [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
          require.resolve('@babel/plugin-proposal-export-default-from'),
          require.resolve('@babel/plugin-syntax-dynamic-import'),
          [
            require.resolve('@babel/plugin-proposal-object-rest-spread'),
            { loose: true, useBuiltIns: true },
          ],
          require.resolve('babel-plugin-macros'),
        ],
      },
    },
  ],
  include: [/node_modules/],
  exclude: [regexp],
};

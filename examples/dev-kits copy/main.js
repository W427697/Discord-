module.exports = {
  stories: ['./stories/*.*'],
  webpack: async (config, { configType }) => ({
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.(ts|tsx)$/,
          loader: require.resolve('babel-loader'),
          options: {
            presets: [['react-app', { flow: false, typescript: true }]],
          },
        },
        {
          test: [/\.stories\.(jsx?$|tsx?$)/],
          enforce: 'pre',
          use: [
            {
              loader: require.resolve('@storybook/source-loader'),
            },
          ],
        },
      ],
    },
    resolve: {
      ...config.resolve,
      extensions: [...(config.resolve.extensions || []), '.ts', '.tsx'],
    },
  }),
};

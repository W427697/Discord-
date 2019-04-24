// const { DefinePlugin, ContextReplacementPlugin } = require('webpack');

module.exports = async ({ config }) => ({
  ...config,
  module: {
    ...config.module,
    rules: [
      ...config.module.rules,
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  // plugins: [
  //   ...config.plugins,
  //   // graphql sources check process variable
  //   new DefinePlugin({
  //     process: JSON.stringify(true),
  //   }),

  //   // See https://github.com/graphql/graphql-language-service/issues/111#issuecomment-306723400
  //   new ContextReplacementPlugin(/graphql-language-service-interface[/\\]dist/, /\.js$/),
  // ],
  resolve: {
    ...config.resolve,
    extensions: [...(config.resolve.extensions || []), '.ts', '.tsx'],
  },
});

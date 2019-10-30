export function webpack(config) {
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.jsx$/ /* XXX adamhaile/surplus-loader#4 */,
          loader: require.resolve('surplus-loader'),
        },
      ],
    },
    resolve: {
      ...config.resolve,
      extensions: [...config.resolve.extensions, '.jsx'],
      alias: config.resolve.alias,
    },
  };
}

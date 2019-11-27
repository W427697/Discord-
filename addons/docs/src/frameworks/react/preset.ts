export function webpack(webpackConfig: any = {}, options: any = {}) {
  const { tsDocgenLoaderOptions } = options;
  if (tsDocgenLoaderOptions) {
    webpackConfig.module.rules.push({
      test: /\.tsx$/,
      use: [
        {
          loader: require.resolve('react-docgen-typescript-loader'),
          options: tsDocgenLoaderOptions,
        },
      ],
    });
  }
  return webpackConfig;
}

export function webpackFinal(webpackConfig: any = {}, options: any = {}) {
  webpackConfig.module.rules.push({
    test: /\.vue$/,
    loader: 'vue-simple-docgen-loader',
    enforce: 'post',
    options: {
      docgenOptions: {
        alias: webpackConfig.resolve.alias,
        ...options.vueDocgenOptions,
      },
    },
  });
  return webpackConfig;
}

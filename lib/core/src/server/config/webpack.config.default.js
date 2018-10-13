import autoprefixer from 'autoprefixer';
import findUp from 'find-up';

export function createDefaultWebpackConfig(storybookBaseConfig) {
  const postcssConfig = findUp.sync('postcss.config.js', {
    cwd: storybookBaseConfig.context,
  });

  return {
    ...storybookBaseConfig,
    module: {
      ...storybookBaseConfig.module,
      rules: [
        ...storybookBaseConfig.module.rules,
        {
          test: /\.css$/,
          use: [
            require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: postcssConfig
                ? {
                    postcssConfig,
                  }
                : {
                    plugins: () => [
                      require('postcss-flexbugs-fixes'), // eslint-disable-line global-require
                      autoprefixer({
                        flexbox: 'no-2009',
                      }),
                    ],
                  },
            },
          ],
        },
        {
          test: /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
          loader: require.resolve('file-loader'),
          query: {
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
        {
          test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
          loader: require.resolve('url-loader'),
          query: {
            limit: 10000,
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
      ],
    },
  };
}

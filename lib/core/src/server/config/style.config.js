import autoprefixer from 'autoprefixer';
import findUp from 'find-up';

export default function getStyleConfig(baseConfig) {
  // null if file is not found
  const postcssConfig = findUp.sync('postcss.config.js', {
    cwd: baseConfig.context,
  });

  // Used only if no postcss.config.js file is found
  const defaultPostCSSConfig = {
    plugins: () => [
      require('postcss-flexbugs-fixes'), // eslint-disable-line global-require
      autoprefixer({
        flexbox: 'no-2009',
      }),
    ],
  };

  return {
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
        options: postcssConfig || defaultPostCSSConfig,
      },
    ],
  };
}

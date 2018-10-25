import { logger } from '@storybook/node-logger';
import autoprefixer from 'autoprefixer';
import findUp from 'find-up';

export default function getStyleConfig(baseConfig) {
  // null if file is not found
  const customPostcssConfig = findUp.sync('postcss.config.js', {
    cwd: baseConfig.context,
  });

  let postcssConfig = {};
  if (customPostcssConfig) {
    logger.info('=> Using postcss.config.js');
    postcssConfig = {
      config: {
        path: customPostcssConfig,
      },
    };
  } else {
    postcssConfig = {
      plugins: () => [
        // eslint-disable-next-line global-require
        require('postcss-flexbugs-fixes'),
        autoprefixer({
          flexbox: 'no-2009',
        }),
      ],
    };
  }

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
        options: postcssConfig,
      },
    ],
  };
}

import { includePaths } from '../utils';

// Add a default custom config which is similar to what React Create App does.
module.exports = (storybookBaseConfig) => {
  const newConfig = { ...storybookBaseConfig };
  newConfig.module.rules = [
    ...storybookBaseConfig.module.rules,
    {
      test: /\.css?$/,
      include: includePaths,
      use: [
        { loader: require.resolve('style-loader') },
        { loader: `${require.resolve('css-loader')}?importLoaders=1` }
      ],
    },
    {
      test: /\.json$/,
      include: includePaths,
      use: [{
        loader: require.resolve('json-loader'),
      }],
    },
    {
      test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
      include: includePaths,
      use: [{
        loader: require.resolve('file-loader'),
        query: {
          name: 'static/media/[name].[hash:8].[ext]',
        }
      }]
    },
    {
      test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
      include: includePaths,
      use: [{
        loader: require.resolve('url-loader'),
        query: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      }],
    },
  ];
  newConfig.resolve.alias = storybookBaseConfig.resolve.alias;

  // Return the altered config
  return newConfig;
};

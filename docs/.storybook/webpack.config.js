const { DefinePlugin } = require('webpack');

const config = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.yml$/,
        use: ['json-loader', 'yaml-loader'],
      },
      {
        test: /\.(jpg|png|gif|eot|ttf|woff|woff2)$/,
        use: ['file-loader'],
      },
      {
        test: /\.svg$/,
        loader: 'svg-url-loader',
        options: {
          noquotes: true,
        },
      },
    ],
  },
  resolve: {
    alias: {
      gatsby: require.resolve('../.cache/gatsby-browser-entry'),
    },
  },
  plugins: [
    new DefinePlugin({
      __PATH_PREFIX__: JSON.stringify(''),
    }),
  ],
};

module.exports = config;

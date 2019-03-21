import path from 'path';
import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';

// eslint-disable-next-line import/no-extraneous-dependencies
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
// eslint-disable-next-line import/no-extraneous-dependencies
import autoprefixer from 'autoprefixer';

const resolveLocal = dir => path.join(__dirname, dir);

const r = resolveLocal('../../../node_modules');
const out = resolveLocal('../../core/dll');

export default ({ entry, provided = [] }) => ({
  name: 'storybook-ui',
  mode: 'production',

  entry,
  output: {
    publicPath: 'sb_dll/',
    path: out,
    filename: '[name]_dll.js',
    library: '[name]_dll',
  },
  externals: provided,

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /monaco-editor/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    shippedProposals: true,
                    modules: false,
                    targets: '> 0.25%, not dead',
                  },
                ],
                '@babel/preset-react',
                '@babel/preset-flow',
              ],
              plugins: ['@babel/plugin-syntax-dynamic-import'],
            },
          },
        ],
      },
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
            options: {
              ident: 'postcss',
              postcss: {},
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
        test: /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)(\?.*)?$/,
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
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.json'],
    modules: [path.join(__dirname, '../../../node_modules')],
  },

  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.DllPlugin({
      context: r,
      path: `${out}/[name]-manifest.json`,
      name: '[name]_dll',
    }),
    new MonacoWebpackPlugin(),
  ],
  optimization: {
    concatenateModules: true,
    portableRecords: true,
    moduleIds: 'hashed',
    minimizer: [
      new TerserPlugin({
        extractComments: {
          condition: /^\**!|@preserve|@license|@cc_on/i,
          filename: file => file.replace('.js', '.LICENCE'),
          banner: licenseFile => `License information can be found in ${licenseFile}`,
        },
      }),
    ],
  },
  performance: {
    hints: false,
  },
});

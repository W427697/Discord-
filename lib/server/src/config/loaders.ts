import { webpack } from '@storybook/transforms';

const loaders = {
  babel: require.resolve('babel-loader'),
  file: require.resolve('file-loader'),
  url: require.resolve('url-loader'),
  raw: require.resolve('raw-loader'),
  mdx: require.resolve('raw-loader'),
  css: require.resolve('css-loader'),
  style: require.resolve('style-loader'),
  managerEntry: webpack.metadata,
  previewEntry: webpack.runtime,
};

export const css = {
  test: /\.css$/,
  use: [
    loaders.style,
    {
      loader: loaders.css,
      options: {
        importLoaders: 1,
      },
    },
  ],
};

export const fonts = {
  test: /\.(ttf|woff|woff2)(\?.*)?$/,
  loader: loaders.file,
  query: {
    name: 'fonts/[name].[hash:8].[ext]',
  },
};

export const media = {
  test: /\.(svg|webp|ico|jpg|jpeg|png|gif|eot|otf|mp4|webm|wav|mp3|m4a|aac|oga|cur|ani)(\?.*)?$/,
  loader: loaders.url,
  query: {
    limit: 10000,
    name: 'media/[name].[hash:8].[ext]',
  },
};

export const js = {
  test: /\.js$/,
  loader: loaders.babel,
  exclude: [/node_modules/, /dist/],
  options: {
    rootMode: 'upward',
    sourceType: 'unambiguous',
  },
};

export const mjs = {
  test: /\.mjs$/,
  loader: loaders.babel,
  options: {
    rootMode: 'upward',
    sourceType: 'unambiguous',
  },
};

export const md = {
  test: /\.md$/,
  loader: loaders.raw,
};

export const mdx = {
  test: /\.mdx$/,
  use: [
    {
      loader: loaders.babel,
      options: {
        rootMode: 'upward',
        sourceType: 'unambiguous',
      },
    },
    {
      loader: require.resolve('@mdx-js/loader'),
    },
  ],
};

export { loaders as default };

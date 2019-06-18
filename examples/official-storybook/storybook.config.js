export const unused = 'foo';

export const webpack = async (config, env) => config;

// list of globs & external urls
export const entries = [];

export const theme = {};

export const presets = [];
export const addons = [];

export const logLevel = 'info';

export const managerWebpack = async (config, env) => {
  const { default: webpackMerge } = await import('webpack-merge');

  const output = webpackMerge(config, {
    plugins: [],

    resolve: {
      mainFields: ['browser', 'module', 'main'],
    },
  });

  console.log('this shows up in the log!');

  return output;
};

export const output = {
  location: './',
  compress: false,
  preview: true, // would enable/disable or set a custom location
};

export const server = {
  port: 1337,
  host: 'localhost',
  // static: {
  //   '/': 'assets',
  // },
  // ssl: {
  //   ca: [],
  //   cert: '',
  //   key: '',
  // },
  // middleware: async (app, server) => {},
};

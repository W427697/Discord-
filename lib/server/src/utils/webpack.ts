/* eslint-disable @typescript-eslint/ban-ts-ignore */
import webpack from 'webpack';
import webpackMerge from 'webpack-merge';
import { WebpackPluginServe } from 'webpack-plugin-serve';
import WebpackBar, { Reporter } from 'webpackbar';
import killPort from 'kill-port';

import { Preset, PresetMergeAsyncFn } from '@storybook/config/create';

import { WebpackConfig } from '../types/webpack';
import { ConfigPrefix } from '../types/cli';

const ensureEntryIsObject = async (
  entry:
    | string
    | string[]
    | webpack.Entry
    | Promise<string | string[] | webpack.Entry>
    | webpack.EntryFunc
): Promise<webpack.Entry> => {
  const r = await entry;

  if (typeof r === 'function') {
    return ensureEntryIsObject(r());
  }
  if (typeof r === 'string') {
    return { main: [r] };
  }
  if (Array.isArray(r)) {
    return { main: r };
  }
  return r;
};

const addServePlugin = (type: ConfigPrefix): PresetMergeAsyncFn<WebpackConfig> => async (
  base,
  config
) => {
  const { host, devPorts } = await config.server;
  const port = devPorts[type];

  await killPort(port, 'tcp');

  return webpackMerge(base, {
    entry: {
      [`${type}/hmr`]: ['webpack-plugin-serve/client'],
    },
    plugins: [
      new WebpackPluginServe({
        static: base.output.path,
        client: {
          address: `${host}:${port}`,
          silent: true,
        },
        // TODO:
        // this injects quite a bit UI I don't like, would love to build something custom based on this
        // https://github.com/shellscape/webpack-plugin-serve/blob/master/lib/client/client.js
        status: true,
        progress: true,
        host,
        port,
        // open: true,
        log: { level: 'error', timestamp: false },
        hmr: true,
        compress: true,
      }),
    ],
  });
};
const webpackServePreset: Preset = {
  managerWebpack: addServePlugin('manager'),
  webpack: addServePlugin('preview'),
};

const addReporterPlugin = (
  type: ConfigPrefix,
  reporter: Reporter
): PresetMergeAsyncFn<WebpackConfig> => async base => {
  // @ts-ignore
  return webpackMerge(base, {
    plugins: [
      new WebpackBar({
        name: type,
        color: 'hotpink',
        profile: false,
        fancy: false,
        basic: false,
        reporter,
        reporters: [],
      }),
    ],
  });
};
const createWebpackReporterPreset = (reporter: Reporter): Preset => ({
  managerWebpack: addReporterPlugin('manager', reporter),
  webpack: addReporterPlugin('preview', reporter),
});

export { ensureEntryIsObject, webpackServePreset, createWebpackReporterPreset };

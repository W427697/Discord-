import webpack from 'webpack';
import webpackMerge from 'webpack-merge';
import { WebpackPluginServe } from 'webpack-plugin-serve';
import WebpackBar, { Reporter } from 'webpackbar';
import killPort from 'kill-port';

import { create } from './entrypointsPlugin';

import { StorybookConfig, ConfigPrefix, ServerConfig, PresetFn } from '../types';

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

const createStorybookEntryPreset = (
  type: ConfigPrefix,
  config: StorybookConfig
): PresetFn => async () => {
  switch (type) {
    case 'manager': {
      return {
        managerWebpack: async (base, env) => {
          const { plugin, entries } = create(config.entries, {});

          return webpackMerge(base, {
            entry: await entries(),
            plugins: [plugin],
          });
        },
      };
    }
    case 'preview': {
      return {};
    }
    default: {
      return {};
    }
  }
};

const createWebpackServePreset = (
  type: ConfigPrefix,
  serverConfig: ServerConfig
): PresetFn => async () => {
  if (type === 'manager') {
    return {
      managerWebpack: async webpackConfig => {
        const host = serverConfig.host || 'localhost';
        const port = serverConfig.devPorts.manager || 555550;

        await killPort(port, 'tcp');

        // eslint-disable-next-line no-param-reassign
        webpackConfig.entry = await ensureEntryIsObject(webpackConfig.entry);

        return webpackMerge(webpackConfig, {
          entry: {
            hmr: ['webpack-plugin-serve/client'],
          },
          plugins: [
            new WebpackPluginServe({
              static: webpackConfig.output.path,
              client: {
                address: `${host}:${port}`,
                silent: true,
              },
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
      },
    };
  }
  if (type === 'preview') {
    return {};
  }
  return {};
};

const createWebpackReporterPreset = (
  type: ConfigPrefix,
  reporter: Reporter
): PresetFn => async () => {
  if (type === 'manager') {
    return {
      managerWebpack: async webpackConfig => {
        // eslint-disable-next-line no-param-reassign
        webpackConfig.entry = await ensureEntryIsObject(webpackConfig.entry);

        return webpackMerge(webpackConfig, {
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
      },
    };
  }
  if (type === 'preview') {
    return {};
  }
  return {};
};

export {
  ensureEntryIsObject,
  createWebpackServePreset,
  createWebpackReporterPreset,
  createStorybookEntryPreset,
};

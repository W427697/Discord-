import webpack from 'webpack';
import webpackmerge from 'webpack-merge';
import { WebpackPluginServe } from 'webpack-plugin-serve';
import WebpackBar, { Reporter } from 'webpackbar';

import { StorybookConfig, ConfigPrefix, Preset, WebpackConfig, OutputConfig } from '../types';

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

const createWebpackServePreset = (type: ConfigPrefix): Preset => async (): Promise<
  StorybookConfig
> => {
  if (type === 'manager') {
    return {
      managerWebpack: async (webpackConfig: WebpackConfig): Promise<WebpackConfig> => {
        const host = 'localhost';
        const port = 55550;

        // eslint-disable-next-line no-param-reassign
        webpackConfig.entry = await ensureEntryIsObject(webpackConfig.entry);

        return webpackmerge(webpackConfig, {
          entry: {
            hmr: ['webpack-plugin-serve/client'],
          },
          plugins: [
            new WebpackPluginServe({
              static: webpackConfig.output.path,
              client: {
                address: `${host}${port}/manager-hmr`,
                silent: true,
              },
              // this injects quite a bit UI I don't like, would love to buld something custom based on this
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
): Preset => async (): Promise<StorybookConfig> => {
  if (type === 'manager') {
    return {
      managerWebpack: async (webpackConfig: WebpackConfig): Promise<WebpackConfig> => {
        // eslint-disable-next-line no-param-reassign
        webpackConfig.entry = await ensureEntryIsObject(webpackConfig.entry);

        return webpackmerge(webpackConfig, {
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

export { ensureEntryIsObject, createWebpackServePreset, createWebpackReporterPreset };

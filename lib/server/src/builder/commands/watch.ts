/* eslint-disable @typescript-eslint/ban-ts-ignore */
import setTitle from 'node-bash-title';
import webpack from 'webpack';

import { logger } from '@storybook/node-logger';
import { getConfig } from '@storybook/config';

import { reportError, reportStats, reportProgress, reportSuccess } from '../../utils/ipc';

import { RunParams } from '../../types/runner';
import { WebpackConfig } from '../../types/webpack';
import { ConfigPrefix } from '../../types/cli';

import { createWebpackReporterPreset, webpackServePreset } from '../../utils/webpack';

const getWebpackConfig = async (type: ConfigPrefix, config: ReturnType<typeof getConfig>) => {
  switch (type) {
    case 'manager': {
      return config.managerWebpack;
    }
    case 'preview': {
      return config.webpack;
    }
    default: {
      throw new Error('not supported type, specify "manager" or "preview"');
    }
  }
};

let watcher: webpack.Watching;

const watcherOptions: webpack.ICompiler.WatchOptions = {
  aggregateTimeout: 10,
  ignored: [/\.cache/, /dist/, /test/, /\.log$/],
};

const watcherHandler: webpack.ICompiler.Handler = (err, stats) => {
  if (err) {
    logger.error(err.toString());
    reportError(err);
  }

  if (stats) {
    const { errors, warnings, ...displayStats } = stats.toJson({
      errorDetails: true,
      errors: true,
      warnings: true,
      entrypoints: false,
      modules: false,
      assets: false,
      reasons: false,
      source: false,
      chunks: false,
      children: false,
      // @ts-ignore
      chunkGroups: false,
      chunkModules: false,
    });

    logger.line();
    logger.info(JSON.stringify(displayStats));

    warnings.forEach(e => {
      logger.line();
      logger.warn(e);
    });
    errors.forEach(e => {
      logger.line();
      logger.error(e);
    });
    reportStats(stats);

    if (!err) {
      if (errors.length) {
        reportError(new Error('compilation ended with errors'));
      } else {
        reportSuccess({ message: 'successful compilation' });
      }
      // if(warnings.length) {
      //   reportWarning(new Error('compilation ended with errors'))
      // }
    }
  }
};

const watch = async (webpackConfig: WebpackConfig): Promise<webpack.Watching | null> => {
  try {
    return webpack(webpackConfig).watch(watcherOptions, watcherHandler);
  } catch (e) {
    reportError(e);
    throw e;
  }
};

const commands = {
  init: async (
    type: ConfigPrefix,
    { configFiles, cliOptions, callOptions, envOptions }: RunParams
  ) => {
    reportProgress({ message: 'loading config', progress: 1 });
    const config = getConfig(
      {
        configFile: configFiles.server.location,
        cliOptions,
        callOptions,
        envOptions,
      },
      [
        createWebpackReporterPreset({
          start: ({ state }) => reportProgress(state),
          change: ({ state }) => reportProgress(state),
          update: ({ state }) => reportProgress(state),
          done: ({ state }) => reportProgress(state),
          progress: ({ state }) => {
            if (state.message === 'building') {
              // @ts-ignore
              const [count, active] = state.details || [];
              const { file, loaders } = state.request;

              const activity = loaders && loaders.length ? `${loaders.join(', ')}: ${file}` : file;

              reportProgress({
                ...state,
                message: active,
                details: [activity, count].filter(Boolean),
              });
            } else {
              reportProgress(state);
            }
          },
          allDone: ({ state }) => reportProgress(state),
          beforeAllDone: ({ state }) => reportProgress(state),
          afterAllDone: ({ state }) => reportProgress(state),
        }),
        webpackServePreset,
      ]
    );

    const webpackConfig: WebpackConfig = ((await getWebpackConfig(
      type,
      config
    )) as any) as WebpackConfig;

    watcher = await watch(webpackConfig);
    return watcher;
  },
  stop: async () => {
    return new Promise((res, rej) => {
      if (watcher) {
        watcher.close(() => res());
      } else {
        rej(new Error('watcher not active'));
      }
    });
  },
};

interface CommandInitiator {
  command: keyof typeof commands;
  options: RunParams;
  type: ConfigPrefix;
}

process.on('message', async ({ command, options, type }: CommandInitiator) => {
  try {
    await commands[command](type, options);
    reportSuccess({ message: 'command completed' });
  } catch (e) {
    reportError(e);
  }
  setTitle(`storybook ${type} ${command}`);
});

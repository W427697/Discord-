import setTitle from 'node-bash-title';
import webpack from 'webpack';

import { reportError, reportStats, reportProgress, reportSuccess } from '../../utils/ipc';

import { RunParams } from '../../types/runner';
import { WebpackConfig } from '../../types/webpack';
import { Config } from '../../types/config';
import { ConfigPrefix } from '../../types/cli';

import { getConfig } from '../../config/config';
import { createWebpackReporterPreset, webpackServePreset } from '../../utils/webpack';

const getWebpackConfig = async (type: ConfigPrefix, config: Config) => {
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
};

const watcherHandler: webpack.ICompiler.Handler = (err, stats) => {
  if (err) {
    console.log(err);
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

    console.log();
    console.log(displayStats);

    warnings.forEach(e => {
      console.log();
      console.log(e);
    });
    errors.forEach(e => {
      console.log();
      console.log(e);
    });
    reportStats(stats);
  }
  if (!err) {
    reportSuccess({ message: 'successful compilation' });
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
        configFile: configFiles.node.location,
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
          progress: ({ state }) => reportProgress(state),
          allDone: ({ state }) => reportProgress(state),
          beforeAllDone: ({ state }) => reportProgress(state),
          afterAllDone: ({ state }) => reportProgress(state),
        }),
        webpackServePreset,
      ]
    );

    const webpackConfig = await getWebpackConfig(type, config);

    // console.dir(webpackConfig, { depth: 20 });

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

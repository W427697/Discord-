import { logger } from '@storybook/node-logger';

import { cleanCliOptions } from './utils/cli';

import * as terminalApp from './terminal-app/app';
import * as builder from './builder/index';
import * as server from './http/http';

import { StartOptions, EnvironmentType } from './types';

// main function
const start = async ({ configsFiles, callOptions, cliOptions: cliOptionsRaw }: StartOptions) => {
  logger.warn('experimental mono config mode enabled');

  const env: EnvironmentType = 'development';

  // filter the cli options
  const cliOptions = cleanCliOptions(cliOptionsRaw);

  terminalApp.run({
    server: () => server.run(configsFiles, cliOptions, callOptions),
    manager: () =>
      builder.run({
        command: 'watch',
        type: 'manager',
        env,
        cliOptions,
        configsFiles,
        callOptions,
      }),
    preview: () => builder.fake(),
  });
};

export { start };

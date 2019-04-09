import { logger } from '@storybook/node-logger';

import { cleanCliOptions } from './utils/cli';

import * as terminalApp from './terminal-app/app-blessed';
import * as builder from './builder/index';
import * as server from './http/http';

import { StartOptions, EnviromentType } from './types';

// main function
const start = async ({ configsFiles, callOptions, cliOptions: cliOptionsRaw }: StartOptions) => {
  logger.warn('experimental mono config mode enabled');

  const env: EnviromentType = 'development';

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
  });
};

export { start };

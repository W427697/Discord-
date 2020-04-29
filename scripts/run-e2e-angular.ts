/* eslint-disable no-irregular-whitespace */
import { exec } from './utils/command';

import runTests, { Options } from './run-e2e';

const logger = console;

const parameters = {
  name: 'angular',
  version: 'latest',
  generator: [
    `yarn add @angular/cli@{{version}} --no-lockfile --non-interactive --silent --no-progress`,
    `npx ng new {{name}}-v{{version}} --routing=true --minimal=true --style=scss --skipInstall=true`,
  ].join(' && '),
};

const addRequiredDeps = async ({ cwd }: Options) => {
  logger.info(`🌍 Using overrided tasks`);
  // FIXME: Move `react` and `react-dom` deps to @storybook/angular
  await exec(`yarn add -D react react-dom --no-lockfile --non-interactive --silent --no-progress`, {
    cwd,
  });
};

runTests(parameters, { addRequiredDeps });

/* eslint-disable no-irregular-whitespace */
import path from 'path';
import { remove, ensureDir, pathExists, writeFile } from 'fs-extra';
import { prompt } from 'enquirer';
import dedent from 'ts-dedent';

import { serve } from './utils/serve';
import { exec } from './utils/command';

const logger = console;

const parameters = {
  name: 'angular',
  version: 'latest',
  generator: dedent`
    npx -p @angular/cli@{{version}} ng new {{name}}-v{{version}} --routing=true --minimal=true --style=scss --skipInstall=true --directory ./
  `,
};

interface Options {
  name: string;
  version: string;
  generator: string;
  cwd?: string;
}

const rootDir = path.join(__dirname, '..');
const siblingDir = path.join(__dirname, '..', '..', 'storybook-e2e-testing');

const prepareDirectory = async (options: Options): Promise<boolean> => {
  const siblingExists = await pathExists(siblingDir);

  if (!siblingExists) {
    await ensureDir(siblingDir);
    await exec('git init', { cwd: siblingDir });
    await writeFile(path.join(siblingDir, '.gitignore'), 'node_modules\n');
  }

  const cwdExists = await pathExists(options.cwd);

  if (cwdExists) {
    return true;
  }

  await ensureDir(options.cwd);

  return false;
};

const cleanDirectory = async ({ cwd }: Options): Promise<void> => {
  return remove(cwd);
};

const generate = async ({ cwd, name, version, generator }: Options) => {
  const command = generator.replace(/{{name}}/g, name).replace(/{{version}}/g, version);
  logger.info(`🏗 Bootstrapping ${name} project`);
  logger.debug(command);

  try {
    await exec(command, { cwd });
  } catch (e) {
    logger.error(`‼️ Error during ${name} bootstrapping`);
    throw e;
  }
};

const initStorybook = async ({ cwd }: Options) => {
  logger.info(`🎨 Initializing Storybook with @storybook/cli`);
  try {
    await exec(`npx -p @storybook/cli sb init --skip-install --yes`, { cwd });
  } catch (e) {
    logger.error(`‼️ Error during Storybook initialization`);
    throw e;
  }
};

const addRequiredDeps = async ({ cwd }: Options) => {
  logger.info(`🌍 Adding needed deps & installing all deps`);
  try {
    // FIXME: Move `react` and `react-dom` deps to @storybook/angular
    await exec(
      `yarn add -D react react-dom --no-lockfile --non-interactive --silent --no-progress`,
      { cwd }
    );
  } catch (e) {
    logger.error(`🚨 Dependencies installation failed`);
    throw e;
  }
};

const buildStorybook = async ({ cwd }: Options) => {
  logger.info(`👷 Building Storybook`);
  try {
    await exec(`yarn build-storybook --quiet`, { cwd });
  } catch (e) {
    logger.error(`🚨 Storybook build failed`);
    throw e;
  }
};

const serveStorybook = async ({ cwd }: Options, port: string) => {
  const staticDirectory = path.join(cwd, 'storybook-static');
  logger.info(`🌍 Serving ${staticDirectory} on http://localhost:${port}`);

  return serve(staticDirectory, port);
};

const runCypress = async ({ name, version }: Options, location: string) => {
  logger.info(`🤖 Running Cypress tests`);
  try {
    await exec(
      `yarn cypress run --config integrationFolder="cypress/generated" --env location="${location}"`,
      { cwd: rootDir }
    );
    logger.info(`✅ E2E tests success`);
    logger.info(`🎉 Storybook is working great with ${name} ${version}!`);
  } catch (e) {
    logger.error(`🚨 E2E tests fails`);
    throw e;
  }
};

const runTests = async ({ name, version, ...rest }: Options) => {
  const options = {
    name,
    version,
    ...rest,
    cwd: path.join(siblingDir, name, version),
  };

  logger.info(`🏃‍♀️ Starting for ${name} ${version}`);
  logger.log();
  logger.debug(options);
  logger.log();

  if (!(await prepareDirectory(options))) {
    await generate(options);
    logger.log();

    await initStorybook(options);
    logger.log();

    await addRequiredDeps(options);
    logger.log();

    await buildStorybook(options);
    logger.log();
  }

  const server = await serveStorybook(options, '4000');
  logger.log();

  await runCypress(options, 'http://localhost:4000');
  logger.log();

  server.close();
};

// Run tests!
runTests(parameters)
  .catch((e) => {
    logger.error(`🛑 an error occurred\n${e}`);
    process.exitCode = 1;
  })
  .then(async () => {
    if (!process.env.CI) {
      const { name, version } = parameters;
      const cwd = path.join(siblingDir, name, version);

      const cleanup = await prompt({
        type: 'confirm',
        name: 'cleanup',
        message: 'Should perform cleanup?',
      });

      if (cleanup) {
        logger.log();
        logger.info(`🗑 Cleaning ${cwd}`);
        await cleanDirectory({ ...parameters, cwd });
      } else {
        logger.log();
        logger.info(`🚯 No cleanup happened: ${cwd}`);
      }

      process.exit(process.exitCode || 0);
    }
  });

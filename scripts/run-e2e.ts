/* eslint-disable no-irregular-whitespace */
import path from 'path';
import { remove, ensureDir, pathExists, writeFile } from 'fs-extra';
import { prompt } from 'enquirer';

import { serve } from './utils/serve';
import { exec } from './utils/command';

const logger = console;

export interface Parameters {
  name: string;
  version: string;
  generator: string;
}

export interface Options extends Parameters {
  cwd?: string;
}

interface Tasks {
  addRequiredDeps(options: Options): Promise<void>;
}

const rootDir = path.join(__dirname, '..');
const siblingDir = path.join(__dirname, '..', '..', 'storybook-e2e-testing');

const prepareDirectory = async (options: Options): Promise<boolean> => {
  const siblingExists = await pathExists(siblingDir);

  if (!siblingExists) {
    await ensureDir(siblingDir);
    await exec('git init', { cwd: siblingDir });
    await exec('npm init -y', { cwd: siblingDir });
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
  await remove(cwd);
  await remove(path.join(siblingDir, 'node_modules'));
};

const generate = async ({ cwd, name, version, generator }: Options) => {
  const command = generator.replace(/{{name}}/g, name).replace(/{{version}}/g, version);
  logger.info(`🏗  Bootstrapping ${name} project`);
  logger.debug(command);

  try {
    await exec(command, { cwd });
  } catch (e) {
    logger.error(`🚨 Bootstrapping ${name} failed`);
    throw e;
  }
};

const initStorybook = async ({ cwd }: Options) => {
  logger.info(`🎨 Initializing Storybook with @storybook/cli`);
  try {
    await exec(`npx -p @storybook/cli sb init --skip-install --yes`, { cwd });
  } catch (e) {
    logger.error(`🚨 Storybook initialization failed`);
    throw e;
  }
};

const addRequiredDeps = async (options: Options, tasks: Partial<Tasks>) => {
  logger.info(`🌍 Adding needed deps & installing all deps`);
  try {
    const task = () => exec(`yarn`, { cwd: options.cwd });
    await (tasks.addRequiredDeps || task)(options);
  } catch (e) {
    logger.error(`🚨 Dependencies installation failed`);
    throw e;
  }
};

const buildStorybook = async ({ cwd }: Options) => {
  logger.info(`👷 Building Storybook`);
  try {
    await exec(`yarn build-storybook --quiet`, { cwd });
  } catch (e) {
    logger.error(`🚨 Storybook build failed`);
    throw e;
  }
};

const serveStorybook = async ({ cwd }: Options, port: string) => {
  const staticDirectory = path.join(cwd, 'storybook-static');
  logger.info(`🌍 Serving ${staticDirectory} on http://localhost:${port}`);

  return serve(staticDirectory, port);
};

const runCypress = async ({ name, version }: Options, location: string, open: boolean) => {
  const cypressCommand = open ? 'open' : 'run';
  logger.info(`🤖 Running Cypress tests`);
  try {
    await exec(
      `yarn cypress ${cypressCommand} --config integrationFolder="cypress/generated" --env location="${location}"`,
      { cwd: rootDir }
    );
    logger.info(`✅ E2E tests success`);
    logger.info(`🎉 Storybook is working great with ${name} ${version}!`);
  } catch (e) {
    logger.error(`🚨 E2E tests fails`);
    throw e;
  }
};

const runTests = async ({ name, version, ...rest }: Parameters, overrideTasks: Partial<Tasks>) => {
  const options = {
    name,
    version,
    ...rest,
    ...overrideTasks,
    cwd: path.join(siblingDir, `${name}-v${version}`),
  };

  logger.info(`🏃‍♀️ Starting for ${name} ${version}`);
  logger.log();
  logger.debug(options);
  logger.log();

  if (!(await prepareDirectory(options))) {
    await generate({ ...options, cwd: siblingDir });
    logger.log();

    await initStorybook(options);
    logger.log();

    await addRequiredDeps(options, overrideTasks);
    logger.log();

    await buildStorybook(options);
    logger.log();
  }

  const server = await serveStorybook(options, '4000');
  logger.log();

  let open = false;
  if (!process.env.CI) {
    ({ open } = await prompt({
      type: 'confirm',
      name: 'open',
      message: 'Should open cypress?',
    }));
  }

  await runCypress(options, 'http://localhost:4000', open);
  logger.log();

  server.close();
};

// Run tests!
const runE2E = (parameters: Parameters, overrideTasks: Partial<Tasks> = {}) =>
  runTests(parameters, overrideTasks)
    .catch((e) => {
      logger.error(`🛑 an error occurred:\n${e}`);
      logger.log();
      logger.error(e);
      logger.log();
      process.exitCode = 1;
    })
    .then(async () => {
      if (!process.env.CI) {
        const { name, version } = parameters;
        const cwd = path.join(siblingDir, `${name}-v${version}`);

        const { cleanup } = await prompt({
          type: 'confirm',
          name: 'cleanup',
          message: 'Should perform cleanup?',
        });

        if (cleanup) {
          logger.log();
          logger.info(`🗑  Cleaning ${cwd}`);
          await cleanDirectory({ ...parameters, cwd });
        } else {
          logger.log();
          logger.info(`🚯 No cleanup happened: ${cwd}`);
        }
      }

      process.exit(process.exitCode || 0);
    });

export default runE2E;

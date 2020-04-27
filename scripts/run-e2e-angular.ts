import path from 'path';
import shell from 'shelljs';
import { remove, ensureDir, pathExists } from 'fs-extra';
import { serve } from './utils/serve';
import { exec } from './utils/command';

const logger = console;
const defaultAngularCliVersion = 'latest';

const parameters = {
  name: 'angular',
  version: 'latest',
  generator: `
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

const prepareDirectory = async (options: Options): Promise<void> => {
  await shell.mv(
    '-n',
    path.join(rootDir, 'node_modules'),
    path.join(rootDir, 'temp_renamed_node_modules')
  );

  if (await pathExists(options.cwd)) {
    await cleanDirectory(options);
  }

  return ensureDir(options.cwd);
};

const cleanDirectory = async ({ cwd }: Options): Promise<void> => {
  await shell.mv(
    '-n',
    path.join(rootDir, 'temp_renamed_node_modules'),
    path.join(rootDir, 'node_modules')
  );

  return remove(cwd);
};

const generate = async ({ cwd, name, version, generator }: Options) => {
  const command = generator.replace(/{{name}}/g, name).replace(/{{version}}/g, version);
  logger.info(`🏗 Bootstrapping ${name} project with "${command}"`);

  try {
    await exec(command, { cwd });
  } catch (e) {
    logger.error(`‼️ Error during ${name} bootstrapping`);
    throw e;
  }
};

const initStorybook = async ({ cwd }: Options) => {
  logger.info(`🎨 Initializing Storybook with @storybook/cli`);
  try {
    await exec(`npx -p @storybook/cli sb init --skip-install --yes`, { cwd });
  } catch (e) {
    logger.error(`‼️ Error during Storybook initialization`);
    throw e;
  }
};

const addRequiredDeps = async ({ cwd }: Options) => {
  logger.info(`🌍 Adding needed deps & installing all deps`);
  try {
    // FIXME: Move `react` and `react-dom` deps to @storybook/angular
    await exec(`yarn add -D react react-dom`, { cwd });
  } catch (e) {
    logger.error(`‼️ Error dependencies installation`);
    throw e;
  }
};

const buildStorybook = async ({ cwd }: Options) => {
  logger.info(`👷 Building Storybook`);
  try {
    await exec(`yarn build-storybook`, { cwd });
  } catch (e) {
    logger.error(`‼️ Error during Storybook build`);
    throw e;
  }
};

const serveStorybook = async ({ cwd }: Options, port: string) => {
  return serve(path.join(cwd, 'storybook-static'), port);
};

const runCypress = async (_: Options, location: string) => {
  logger.info(`🤖 Running Cypress tests`);
  try {
    await exec(`yarn cypress run --env location="${location}"`, {
      cwd: path.join(__dirname, '..'),
    });
  } catch (e) {
    logger.error(`‼️ Error during cypress tests execution`);
    throw e;
  }
};

const runTests = async ({ name, version, ...rest }: Options) => {
  const options = {
    name,
    version,
    ...rest,
    cwd: path.join(__dirname, '..', 'e2e', name, version),
  };

  logger.info(`📡 Starting E2E for ${name} ${version}`);

  await prepareDirectory(options);

  await generate(options);

  await initStorybook(options);

  await addRequiredDeps(options);

  await buildStorybook(options);

  const server = await serveStorybook(options, '4000');

  await runCypress(options, 'http://localhost:4000');

  // TODO: Add a variable to skip this cleaning (based on  process.env.CI?), in order to simplify debugging for instance
  logger.info(`🗑 Cleaning test dir for ${name} ${version}`);
  await cleanDirectory(options);
  server.close();

  logger.info(`🎉 Storybook is working great with ${name} ${version}!`);
};

let angularCliVersions = process.argv.slice(2);

if (!angularCliVersions || angularCliVersions.length === 0) {
  angularCliVersions = [defaultAngularCliVersion];
}

// Run tests!
runTests(parameters).catch((e) => {
  logger.error(`🚨 E2E tests fails\n${e}`);
  process.exit(1);
});

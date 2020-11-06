/* eslint-disable no-irregular-whitespace */
import path from 'path';
import { remove, ensureDir, pathExists, writeFile, readJSON, writeJSON } from 'fs-extra';
import { prompt } from 'enquirer';
import pLimit from 'p-limit';

import shell from 'shelljs';
import program from 'commander';
import { serve } from './utils/serve';
import { exec } from './utils/command';
// @ts-ignore
import { listOfPackages } from './utils/list-packages';
// @ts-ignore
import { filterDataForCurrentCircleCINode } from './utils/concurrency';

import * as configs from './run-e2e-config';

const logger = console;

interface BaseParameters {
  /** E2E configuration name */
  name: string;
  /** framework version */
  version: string;
  /** Use storybook framework detection */
  autoDetect?: boolean;
  /** Pre-build hook */
  preBuildCommand?: string;
  /** When cli complains when folder already exists */
  ensureDir?: boolean;
  /** Dependencies to add before building Storybook */
  additionalDeps?: string[];
  /** Add typescript dependency and creates a tsconfig.json file */
  typescript?: boolean;
}

interface GeneratorParameter extends BaseParameters {
  source?: 'generator';
  /** CLI to bootstrap the project */
  generator: string;
}
interface RepositoryParameter extends BaseParameters {
  source: 'repository';
  repository: string;
}

export type Parameters = GeneratorParameter | RepositoryParameter;

export type Options = Parameters & {
  rootCwd?: string;
  cwd?: string;
};

const rootDir = path.join(__dirname, '..');
const parentDir = path.join(__dirname, '..', '..');
const siblingDir = path.join(__dirname, '..', '..', 'storybook-e2e-testing');

const prepareDirectory = async (options: Options): Promise<boolean> => {
  const { cwd, source, ensureDir: ensureDirOption = true } = options;
  if (source === 'repository') {
    // git clone will create repository for us
    return cloneRepository(options);
  }
  const siblingExists = await pathExists(siblingDir);

  if (!siblingExists) {
    await ensureDir(siblingDir);
    await exec('git init', { cwd: siblingDir });
    await exec('npm init -y', { cwd: siblingDir });
    await writeFile(path.join(siblingDir, '.gitignore'), 'node_modules\n');
  }

  const cwdExists = await pathExists(cwd);

  if (cwdExists) {
    return true;
  }

  if (ensureDirOption) {
    await ensureDir(cwd);
  }

  return false;
};

const cleanDirectory = async ({ cwd, rootCwd, source }: Options): Promise<void> => {
  if (source === 'repository') {
    await remove(rootCwd);
  } else {
    await remove(cwd);
    await remove(path.join(rootCwd, 'node_modules'));

    if (useYarn2) {
      await shell.rm('-rf', [path.join(rootCwd, '.yarn'), path.join(rootCwd, '.yarnrc.yml')]);
    }
  }
};

const configureYarn2 = async ({ cwd }: Options) => {
  const command = [
    `yarn set version berry`,
    // ⚠️ Need to set registry because Yarn 2 is not using the conf of Yarn 1
    `yarn config set npmScopes --json '{ "storybook": { "npmRegistryServer": "http://localhost:6000/" } }'`,
    // Some required magic to be able to fetch deps from local registry
    `yarn config set unsafeHttpWhitelist --json '["localhost"]'`,
    // Disable fallback mode to make sure everything is required correctly
    `yarn config set pnpFallbackMode none`,
    // Add package extensions
    // https://github.com/casesandberg/reactcss/pull/153
    `yarn config set "packageExtensions.reactcss@*.peerDependencies.react" "*"`,
    // https://github.com/casesandberg/react-color/pull/746
    `yarn config set "packageExtensions.react-color@*.peerDependencies.react" "*"`,
  ].join(' && ');
  logger.info(`🎛 Configuring Yarn 2`);
  logger.debug(command);

  try {
    await exec(command, { cwd });
  } catch (e) {
    logger.error(`🚨 Configuring Yarn 2 failed`);
    throw e;
  }
};

const cloneRepository = async (options: Options): Promise<boolean> => {
  if (options.source !== 'repository') {
    return false;
  }

  const { repository, cwd } = options;

  const repositoryExists = await pathExists(cwd);
  if (repositoryExists) {
    return true;
  }
  logger.info(`Cloning repository ${repository}`);
  await exec(`git clone ${repository}`, { cwd: parentDir });
  return false;
};

/** There are 2 ways of generating a e2e config
 * - using the generator function
 * - cloning the repository
 */
const generate = async (options: Options) => {
  if (options.source === 'repository') {
    return;
  }
  const { cwd, name, version } = options;

  let command = options.generator.replace(/{{name}}/g, name).replace(/{{version}}/g, version);
  if (useYarn2) {
    command = command.replace(/npx/g, `yarn dlx`);
  }

  logger.info(`🏗  Bootstrapping ${name} project`);
  logger.debug(command);

  try {
    await exec(command, { cwd });
  } catch (e) {
    logger.error(`🚨 Bootstrapping ${name} failed`);
    throw e;
  }
};

const initStorybook = async ({ cwd, autoDetect = true, name }: Options) => {
  logger.info(`🎨 Initializing Storybook with @storybook/cli`);
  try {
    const type = autoDetect ? '' : `--type ${name}`;

    const sbCLICommand = useLocalSbCli
      ? 'node ../../storybook/lib/cli/dist/generate'
      : 'npx -p @storybook/cli sb';

    await exec(`${sbCLICommand} init --yes ${type}`, { cwd });
  } catch (e) {
    logger.error(`🚨 Storybook initialization failed`);
    throw e;
  }
};

// Verdaccio doesn't resolve *
// So we set resolutions manually in package.json
const setResolutions = async ({ cwd }: Options) => {
  logger.info(`🔒 Setting yarn resolutions`);

  const packages = await listOfPackages();

  const packageJsonPath = path.resolve(cwd, 'package.json');
  const packageJson = await readJSON(packageJsonPath, { encoding: 'utf8' });

  packageJson.resolutions = {
    ...packageJson.resolutions,
    ...packages.reduce(
      (acc, { name, version }) => ({
        ...acc,
        [name]: version,
      }),
      {}
    ),
  };

  await writeJSON(packageJsonPath, packageJson, { encoding: 'utf8', spaces: 2 });
};

const addRequiredDeps = async ({ cwd, additionalDeps }: Options) => {
  logger.info(`🌍 Adding needed deps & installing all deps`);
  try {
    if (additionalDeps && additionalDeps.length > 0) {
      await exec(`yarn add -D ${additionalDeps.join(' ')}`, {
        cwd,
      });
    } else {
      await exec(`yarn install`, {
        cwd,
      });
    }
  } catch (e) {
    logger.error(`🚨 Dependencies installation failed`);
    throw e;
  }
};

const addTypescript = async ({ cwd }: Options) => {
  logger.info(`👮🏻 Adding typescript and tsconfig.json`);
  try {
    await exec(`yarn add -D typescript@latest`, { cwd });
    const tsConfig = {
      compilerOptions: {
        baseUrl: '.',
        esModuleInterop: true,
        jsx: 'preserve',
        skipLibCheck: true,
        strict: true,
      },
      include: ['src/*'],
    };
    const tsConfigJsonPath = path.resolve(cwd, 'tsconfig.json');
    await writeJSON(tsConfigJsonPath, tsConfig, { encoding: 'utf8', spaces: 2 });
  } catch (e) {
    logger.error(`🚨 Creating tsconfig.json failed`);
    throw e;
  }
};

const buildStorybook = async ({ cwd, preBuildCommand }: Options) => {
  logger.info(`👷 Building Storybook`);
  try {
    if (preBuildCommand) {
      await exec(preBuildCommand, { cwd });
    }
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
    logger.info(`🥺 Storybook has some issues with ${name} ${version}!`);
    throw e;
  }
};

const runTests = async (options: Options) => {
  const { name, version, rootCwd } = options;

  logger.log();
  logger.info(`🏃‍♀️ Starting for ${name} ${version}`);
  logger.log();
  logger.debug(options);
  logger.log();

  if (!(await prepareDirectory(options))) {
    if (useYarn2) {
      await configureYarn2({ ...options, cwd: rootCwd });
    }

    await generate({ ...options, cwd: rootCwd });
    logger.log();

    await setResolutions(options);
    logger.log();

    if (options.typescript) {
      await addTypescript(options);
      logger.log();
    }

    await initStorybook(options);
    logger.log();

    await addRequiredDeps(options);
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

  try {
    await runCypress(options, 'http://localhost:4000', open);
    logger.log();
  } finally {
    server.close();
  }
};

// Run tests!
const runE2E = async (parameters: Parameters) => {
  const { name, version } = parameters;
  let rootCwd = siblingDir;
  if (parameters.source === 'repository') {
    // Extract name from repo url
    const [, repoName] = parameters.repository.match(/^.*\/(.*).git$/);
    const repositoryFolder = path.join(parentDir, repoName);
    rootCwd = repositoryFolder;
  }
  const cwd = path.join(rootCwd, `${name}-${version}`);
  const options = {
    name,
    version,
    rootCwd,
    cwd,
    ...parameters,
  };
  if (startWithCleanSlate) {
    logger.log();
    logger.info(`♻️  Starting with a clean slate, removing existing ${name} folder`);
    await cleanDirectory(options);
  }

  return runTests(options)
    .then(async () => {
      if (!process.env.CI) {
        const { cleanup } = await prompt<{ cleanup: boolean }>({
          type: 'confirm',
          name: 'cleanup',
          message: 'Should perform cleanup?',
        });

        if (cleanup) {
          logger.log();
          logger.info(`🗑  Cleaning ${cwd}`);
          await cleanDirectory(options);
        } else {
          logger.log();
          logger.info(`🚯 No cleanup happened: ${cwd}`);
        }
      }
    })
    .catch((e) => {
      logger.error(`🛑 an error occurred:\n${e}`);
      logger.log();
      logger.error(e);
      logger.log();
      process.exitCode = 1;
    });
};

program.option('--clean', 'Clean up existing projects before running the tests', false);
program.option('--use-yarn-2', 'Run tests using Yarn 2 instead of Yarn 1 + npx', false);
program.option(
  '--use-local-sb-cli',
  'Run tests using local @storybook/cli package (⚠️ Be sure @storybook/cli is properly build as it will not be rebuild before running the tests)',
  false
);
program.parse(process.argv);

const { useYarn2, useLocalSbCli, clean: startWithCleanSlate, args: frameworkArgs } = program;

const typedConfigs: { [key: string]: Parameters } = configs;
let e2eConfigs: { [key: string]: Parameters } = {};

if (frameworkArgs.length > 0) {
  // eslint-disable-next-line no-restricted-syntax
  for (const [framework, version = 'latest'] of frameworkArgs.map((arg) => arg.split('@'))) {
    e2eConfigs[`${framework}-${version}`] = Object.values(typedConfigs).find(
      (c) => c.name === framework && c.version === version
    );
  }
} else {
  e2eConfigs = typedConfigs;
  // FIXME: For now Yarn 2 E2E tests must be run by explicitly call `yarn test:e2e-framework yarn2Cra@latest`
  //   Because it is telling Yarn to use version 2
  delete e2eConfigs.yarn_2_cra;

  // FIXME: Angular tests need to be explicitly run because they require Node 12.17+
  // See https://github.com/storybookjs/storybook/issues/12735
  delete e2eConfigs.angularv9;
  delete e2eConfigs.angular;

  // CRA Bench is a special case of E2E tests, it requires Node 12 as `@storybook/bench` is using `@hapi/hapi@19.2.0`
  // which itself need Node 12.
  delete e2eConfigs.cra_bench;
}

const perform = () => {
  const limit = pLimit(1);
  const narrowedConfigs = Object.values(e2eConfigs);
  const list = filterDataForCurrentCircleCINode(narrowedConfigs) as Parameters[];

  logger.info(`📑 Will run E2E tests for:${list.map((c) => c.name).join(', ')}`);

  return Promise.all(list.map((config) => limit(() => runE2E(config))));
};

perform().then(() => {
  process.exit(process.exitCode || 0);
});

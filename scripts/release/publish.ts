/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import chalk from 'chalk';
import path from 'path';
import program from 'commander';
import semver from 'semver';
import { z } from 'zod';
import { readJson } from 'fs-extra';
import fetch from 'node-fetch';
import { execaCommand } from '../utils/exec';

program
  .name('publish')
  .description('publish all packages')
  .option('-T, --tag', 'Specify which distribution tag to set for the version being published')
  .option('-D, --dry-run', 'Do not publish, only output to shell', false)
  .option('-V, --verbose', 'Enable verbose logging', false);

const optionsSchema = z
  .object({
    tag: z.string().optional(),
    verbose: z.boolean().optional(),
    dryRun: z.boolean().optional(),
  })
  .refine((schema) => (schema.tag ? !semver.valid(schema.tag) : true), {
    message:
      'The tag can not be a valid semver version, it must be a plain string like "next" or "latest"',
  });

type Options = {
  tag?: string;
  verbose: boolean;
  dryRun?: boolean;
};

const CODE_DIR_PATH = path.join(__dirname, '..', '..', 'code');
const CODE_PACKAGE_JSON_PATH = path.join(CODE_DIR_PATH, 'package.json');

const validateOptions = (options: { [key: string]: any }): options is Options => {
  optionsSchema.parse(options);
  return true;
};

const getCurrentVersion = async () => {
  console.log(`📐 Reading current version of Storybook...`);
  const { version } = await readJson(CODE_PACKAGE_JSON_PATH);
  console.log(`📐 Current version is ${chalk.green(version)}`);
  return version;
};

const isCurrentVersionPublished = async (currentVersion: string, verbose?: boolean) => {
  console.log(`☁️ Checking if ${chalk.green(currentVersion)} is already published...`);

  if (verbose) {
    console.log(`Fetching from npm:`);
    console.log(
      `https://registry.npmjs.org/${chalk.blue(
        '@junk-temporary-prototypes/manager-api'
      )}/${chalk.green(currentVersion)}`
    );
  }
  const response = await fetch(
    `https://registry.npmjs.org/@junk-temporary-prototypes/manager-api/${currentVersion}`
  );
  if (response.status === 404) {
    console.log(`🌤️ ${chalk.green(currentVersion)} is not already published`);
    return false;
  }
  if (response.status !== 200) {
    console.error(
      `Unexpected status code when checking the current version on npm: ${response.status}`
    );
    console.error(await response.text());
    throw new Error(
      `Unexpected status code when checking the current version on npm: ${response.status}`
    );
  }
  const data = await response.json();
  if (verbose) {
    console.log(`Response from npm:`);
    console.log(data);
  }
  if (data.version !== currentVersion) {
    // this should never happen
    console.error(
      `Unexpected version received when checking the current version on npm: ${data.version}`
    );
    console.error(JSON.stringify(data, null, 2));
    throw new Error(
      `Unexpected version received when checking the current version on npm: ${data.version}`
    );
  }

  console.log(`⛈️ ${chalk.green(currentVersion)} is already published`);
  return true;
};

const buildAllPackages = async (verbose?: boolean) => {
  console.log(`🏗️ Building all packages...`);
  await execaCommand('yarn task --task=compile --start-from=compile --no-link', {
    stdio: 'inherit',
    cwd: CODE_DIR_PATH,
  });
  console.log(`🏗️ Packages successfully built`);
};

const getAllPackages = async (verbose?: boolean) => {
  const { stdout } = await execaCommand('yarn workspaces list --json');
  const packages = JSON.parse(stdout);
};

export const run = async (options: unknown) => {
  if (!validateOptions(options)) {
    return;
  }
  const { tag, dryRun, verbose } = options;

  // Get the current version from code/package.json
  const currentVersion = await getCurrentVersion();
  const isPublished = await isCurrentVersionPublished(currentVersion, verbose);
  if (isPublished) {
    throw new Error(
      `⛔ Current version (${chalk.green(currentVersion)}) is already published, aborting.`
    );
  }

  await buildAllPackages(verbose);

  // const allPackages = await getAllPackages(verbose);

  // get the list of packages to publish
  // publish
  // log result
  // check registry for published version
  // retry if needed

  console.log(`✅ Published all packages`);
};

if (require.main === module) {
  const parsed = program.parse();
  run(parsed.opts()).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

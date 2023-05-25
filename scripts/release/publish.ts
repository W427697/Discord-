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
import dedent from 'ts-dedent';
import { execaCommand } from '../utils/exec';

program
  .name('publish')
  .description('publish all packages')
  .option(
    '-T, --tag <tag>',
    'Specify which distribution tag to set for the version being published'
  )
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

const getCurrentVersion = async (verbose?: boolean) => {
  if (verbose) {
    console.log(`📐 Reading current version of Storybook...`);
  }
  const { version } = await readJson(CODE_PACKAGE_JSON_PATH);
  console.log(`📐 Current version of Storybook is ${chalk.green(version)}`);
  return version;
};

const isCurrentVersionPublished = async ({
  packageName,
  currentVersion,
  verbose,
}: {
  packageName: string;
  currentVersion: string;
  verbose?: boolean;
}) => {
  const prettyPackage = `${chalk.blue(packageName)}@${chalk.green(currentVersion)}`;
  console.log(`⛅ Checking if ${prettyPackage} is published...`);

  if (verbose) {
    console.log(`Fetching from npm:`);
    console.log(
      `https://registry.npmjs.org/${chalk.blue(packageName)}/${chalk.green(currentVersion)}`
    );
  }
  const response = await fetch(`https://registry.npmjs.org/${packageName}/${currentVersion}`);
  if (response.status === 404) {
    console.log(`🌤️ ${prettyPackage} is not published`);
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

  console.log(`⛈️ ${prettyPackage} is published`);
  return true;
};

const buildAllPackages = async () => {
  console.log(`🏗️ Building all packages...`);
  await execaCommand('yarn task --task=compile --start-from=compile --no-link', {
    stdio: 'inherit',
    cwd: CODE_DIR_PATH,
  });
  console.log(`🏗️ Packages successfully built`);
};

const publishAllPackages = async ({
  tag,
  verbose,
  dryRun,
}: {
  tag?: string;
  verbose?: boolean;
  dryRun?: boolean;
}) => {
  console.log(`📦 Publishing all packages...`);
  const command = `yarn workspaces foreach --parallel --no-private --verbose npm publish --tolerate-republish ${
    tag ? `--tag ${tag}` : ''
  }`;
  if (verbose) {
    console.log(`📦 Executing: ${command}`);
  }
  if (dryRun) {
    console.log(`📦 Dry run, skipping publish. Would have executed:
    ${chalk.blue(command)}`);
    return;
  }

  // Note this is to fool `ts-node` into not turning the `import()` into a `require()`.
  // See: https://github.com/TypeStrong/ts-node/discussions/1290
  // prettier-ignore
  const pRetry = (
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    (await new Function('specifier', 'return import(specifier)')(
      'p-retry'
      )) as typeof import('p-retry')
      ).default;
  /**
   * 'yarn npm publish' will fail if just one package fails to publish.
   * But it will continue through with all the other packages, and --tolerate-republish makes it okay to publish the same version again.
   * So we can safely retry the whole publishing process if it fails.
   * It's not uncommon for the registry to fail often, which Yarn catches by checking the registry after a package has been published.
   */
  await pRetry(
    () =>
      execaCommand(command, {
        stdio: 'inherit',
        cwd: CODE_DIR_PATH,
      }),
    {
      retries: 4,
      onFailedAttempt: (error) =>
        console.log(
          chalk.yellow(
            dedent`❗One or more packages failed to publish, retrying...
            This was attempt number ${error.attemptNumber}, there are ${error.retriesLeft} retries left. 🤞`
          )
        ),
    }
  );
  console.log(`📦 Packages successfully published`);
};

/*
const checkRegistryForPublishedPackages = async (currentVersion: string, verbose?: boolean) => {
  const { stdout } = await execaCommand('yarn workspaces list --no-private --json', {
    cwd: CODE_DIR_PATH,
  });
  // the output is a newline separated list of JSON objects, and not an actual array... 🤦
  const arrayString = `[${stdout.split('\n').join(',')}]`;

  let packages: {
    location: string;
    name: string;
  }[];
  try {
    packages = JSON.parse(arrayString);
  } catch (e) {
    console.error(`Failed to parse JSON from "yarn workspaces list" output:`);
    console.error(stdout);
    throw e;
  }
  type PackagePublishResult = {
    name: string;
    isPublished: boolean;
  };
  const packagePublishResults = await Promise.allSettled(
    packages.map(async ({ name }) => {
      const isPublished = await isCurrentVersionPublished({
        currentVersion,
        verbose,
        packageName: name,
      });
      return {
        name,
        isPublished,
      };
    })
  );
  const failedPackages = packagePublishResults.filter(
    ({ status }) => status === 'rejected'
  ) as PromiseRejectedResult[];
  const successfulPackages = packagePublishResults.filter(
    ({ status }) => status === 'fulfilled'
  ) as PromiseFulfilledResult<PackagePublishResult>[];
  const publishedPackages = successfulPackages.filter(({ value: { isPublished } }) => isPublished);
  const unpublishedPackages = successfulPackages.filter(
    ({ value: { isPublished } }) => !isPublished
  );

  if (failedPackages.length > 0) {
    console.error(
      `Some packages failed to check for publish status:
      ${failedPackages.map(({ reason }) => reason).join('\n')}`
    );
  }
  if (unpublishedPackages.length > 0) {
    console.error(
      `Some packages remain unpublished:
      ${unpublishedPackages.map(({ value: { name } }) => name).join('\n')}`
    );
  }
  if (publishedPackages.length !== packages.length) {
    throw new Error(
      `Not all packages were published. ${chalk.blue(publishedPackages.length)} / ${chalk.green(
        packages.length
      )} were published.}`
    );
  }
};
 */

export const run = async (options: unknown) => {
  if (!validateOptions(options)) {
    return;
  }
  const { tag, dryRun, verbose } = options;

  // Get the current version from code/package.json
  const currentVersion = await getCurrentVersion(verbose);
  const isAlreadyPublished = await isCurrentVersionPublished({
    currentVersion,
    packageName: '@junk-temporary-prototypes/manager-api',
    verbose,
  });
  if (isAlreadyPublished) {
    throw new Error(
      `⛔ Current version (${chalk.green(currentVersion)}) is already published, aborting.`
    );
  }
  await buildAllPackages();
  await publishAllPackages({ tag, verbose, dryRun });

  // await checkRegistryForPublishedPackages(currentVersion, verbose);
  console.log(
    `✅ Published all packages with version ${chalk.green(currentVersion)}${
      tag ? ` at tag ${chalk.blue(tag)}` : ''
    }`
  );
};

if (require.main === module) {
  const parsed = program.parse();
  run(parsed.opts()).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

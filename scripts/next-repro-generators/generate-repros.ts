/* eslint-disable no-console */
import { join, relative } from 'path';
import { command } from 'execa';
import type { Options as ExecaOptions } from 'execa';
import pLimit from 'p-limit';
import prettyTime from 'pretty-hrtime';
import { copy, emptyDir, ensureDir, rename, writeFile } from 'fs-extra';
import { program } from 'commander';
import reproTemplates from '../../code/lib/cli/src/repro-templates';
import storybookVersions from '../../code/lib/cli/src/versions';
import { JsPackageManagerFactory } from '../../code/lib/cli/src/js-package-manager/JsPackageManagerFactory';

// @ts-ignore
import { maxConcurrentTasks } from '../utils/concurrency';

import { localizeYarnConfigFiles, setupYarn } from './utils/yarn';
import { GeneratorConfig } from './utils/types';
import { getStackblitzUrl, renderTemplate } from './utils/template';

const OUTPUT_DIRECTORY = join(__dirname, '..', '..', 'repros');
const BEFORE_DIR_NAME = 'before-storybook';
const AFTER_DIR_NAME = 'after-storybook';

const addStorybook = async (baseDir: string) => {
  const beforeDir = join(baseDir, BEFORE_DIR_NAME);
  const afterDir = join(baseDir, AFTER_DIR_NAME);
  const tmpDir = join(baseDir, 'tmp');

  await ensureDir(tmpDir);
  await emptyDir(tmpDir);

  await copy(beforeDir, tmpDir);

  const sbCliBinaryPath = join(__dirname, `../../code/lib/cli/bin/index.js`);
  await runCommand(`${sbCliBinaryPath} init`, {
    cwd: tmpDir,
    env: {
      STORYBOOK_DISABLE_TELEMETRY: 'true',
    },
  });

  await rename(tmpDir, afterDir);
};

export const runCommand = async (script: string, options: ExecaOptions) => {
  const shouldDebug = !!process.env.DEBUG;

  if (shouldDebug) {
    console.log(`Running command: ${script}`);
  }

  return command(script, { stdout: shouldDebug ? 'inherit' : 'ignore', ...options });
};

const addDocumentation = async (
  baseDir: string,
  { name, dirName }: { name: string; dirName: string }
) => {
  const afterDir = join(baseDir, AFTER_DIR_NAME);
  const stackblitzConfigPath = join(__dirname, 'templates', '.stackblitzrc');
  const readmePath = join(__dirname, 'templates', 'item.ejs');

  await copy(stackblitzConfigPath, join(afterDir, '.stackblitzrc'));

  const stackblitzUrl = getStackblitzUrl(dirName);
  const contents = await renderTemplate(readmePath, {
    name,
    stackblitzUrl,
  });
  await writeFile(join(afterDir, 'README.md'), contents);
};

const runGenerators = async (
  generators: (GeneratorConfig & { dirName: string })[],
  localRegistry = true
) => {
  console.log(`🤹‍♂️ Generating repros with a concurrency of ${maxConcurrentTasks}`);

  const limit = pLimit(maxConcurrentTasks);

  return Promise.all(
    generators.map(({ dirName, name, script }) =>
      limit(async () => {
        const time = process.hrtime();
        console.log(`🧬 generating ${name}`);

        const baseDir = join(OUTPUT_DIRECTORY, dirName);
        const beforeDir = join(baseDir, BEFORE_DIR_NAME);

        await emptyDir(baseDir);
        await ensureDir(beforeDir);

        await setupYarn({ cwd: baseDir });

        const packageManager = JsPackageManagerFactory.getPackageManager();

        await runCommand(script, { cwd: beforeDir });

        await localizeYarnConfigFiles(baseDir, beforeDir);

        if (localRegistry) {
          // TODO: find a good way to have all this run in the correct cwd (beforeDir)
          console.log(`📦 Configuring local registry`);
          packageManager.addPackageResolutions(storybookVersions);
          packageManager.setRegistryURL('https://foo.bar');
          // TODO: remove this after we make sure the cwd is correct
          process.exit(0);
        }

        await addStorybook(baseDir);

        await addDocumentation(baseDir, { name, dirName });

        console.log(
          `✅ Created ${dirName} in ./${relative(
            process.cwd(),
            baseDir
          )} successfully in ${prettyTime(process.hrtime(time))}`
        );
      })
    )
  );
};

const generate = async ({
  template,
  localRegistry,
}: {
  template?: string;
  localRegistry?: boolean;
}) => {
  const generatorConfigs = Object.entries(reproTemplates)
    .map(([dirName, configuration]) => ({
      dirName,
      ...configuration,
    }))
    .filter(({ dirName }) => {
      if (template) {
        return dirName === template;
      }

      return true;
    });

  runGenerators(generatorConfigs, localRegistry);
};

program
  .description('Create a reproduction from a set of possible templates')
  .option('--template <template>', 'Create a single template')
  .option('--local-registry', 'Use local registry', false)
  .action((options) => {
    generate(options).catch((e) => {
      console.trace(e);
      process.exit(1);
    });
  })
  .parse(process.argv);

/* eslint-disable no-console */
import path, { join, relative } from 'path';
import program from 'commander';
import { command } from 'execa';
import type { Options as ExecaOptions } from 'execa';
import yaml from 'js-yaml';
import pLimit from 'p-limit';
import prettyTime from 'pretty-hrtime';
import { copy, emptyDir, ensureDir, readFile, remove, rename } from 'fs-extra';

const maxConcurrentTasks = 3;

type GeneratorConfig = {
  name: string;
  script: string;
  // expected?: {
  //   framework?: string;
  //   renderer?: string;
  //   builder?: string;
  // };
};

type DataEntry = {
  script: string;
};

const OUTPUT_DIRECTORY = join(__dirname, '..', '..', 'repros');

const addStorybook = async (baseDir: string) => {
  const beforeDir = join(baseDir, 'before');
  const afterDir = join(baseDir, 'after');
  const tmpDir = join(baseDir, '.tmp');

  await ensureDir(tmpDir);
  await emptyDir(tmpDir);

  await copy(beforeDir, tmpDir);

  const sbCliBinaryPath = join(__dirname, `../../code/lib/cli/bin/index.js`);
  await runCommand(`${sbCliBinaryPath} init`, {
    cwd: tmpDir,
  });

  await rename(tmpDir, afterDir);
};

const runCommand = async (script: string, options: ExecaOptions) => {
  // TODO: remove true
  const shouldDebug = true || !!process.env.DEBUG;

  if (shouldDebug) {
    console.log(`Running command: ${script}`);
  }

  return command(script, { stdout: shouldDebug ? 'inherit' : 'ignore', ...options });
};

const runGenerators = async (generators: GeneratorConfig[]) => {
  console.log(`🤹‍♂️ Generating repros with a concurrency of ${maxConcurrentTasks}`);

  const limit = pLimit(maxConcurrentTasks);

  return Promise.all(
    generators.map(({ name, script }) =>
      limit(async () => {
        const time = process.hrtime();
        console.log(`🧬 generating ${name}`);

        const baseDir = join(OUTPUT_DIRECTORY, name);
        const beforeDir = join(baseDir, 'before');
        const afterDir = join(baseDir, 'after');
        const tmpDir = join(baseDir, '.tmp');

        await Promise.all([
          ensureDir(beforeDir).then(() => emptyDir(beforeDir)),
          remove(afterDir),
          remove(tmpDir),
        ]);

        await runCommand('yarn set version self', { cwd: baseDir });

        await remove(join(baseDir, 'package.json'));

        await runCommand(script, { cwd: beforeDir });

        await addStorybook(baseDir);

        console.log(
          `✅ Created ${name} in ./${relative(process.cwd(), baseDir)} successfully in ${prettyTime(
            process.hrtime(time)
          )}`
        );
      })
    )
  );
};

const generate = async ({ config }: { config: string }) => {
  const configContents = await readFile(config, 'utf8');
  const data: Record<string, DataEntry> = yaml.load(configContents);

  runGenerators(
    Object.entries(data).map(([name, configuration]) => ({
      name,
      script: configuration.script,
    }))
  );
};

program
  .description('Create a reproduction from a set of possible templates')
  .option(
    '-c --config <config>',
    'Choose a custom configuration file (.yml format)',
    path.join(__dirname, 'repro-config.yml')
  );

program.parse(process.argv);

const options = program.opts() as { config: string };

generate(options).catch((e) => {
  console.error(e);
  process.exit(1);
});

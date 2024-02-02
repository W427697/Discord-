/// <reference types="node" />

import { promisify } from 'node:util';
import { writeFile } from 'node:fs/promises';
import { exec } from 'node:child_process';
import { readJson } from '@ndelangen/fs-extra-unified';

import { join } from 'node:path';
import semver from 'semver';
import { dedent } from 'ts-dedent';

const rootDirectory = join(__dirname, '..', '..', '..');

const logger = console;

const getMonorepoPackages = async () => {
  const process = promisify(exec);
  const contents = await process('yarn workspaces list --json --no-private', {
    cwd: rootDirectory,
  });

  return JSON.parse(`[${contents.stdout.trim().split('\n').join(',')}]`).map((w) => w.location);
};

const run = async () => {
  let updatedVersion = process.argv[process.argv.length - 1];

  if (!semver.valid(updatedVersion)) {
    updatedVersion = (await readJson(join(rootDirectory, 'package.json'))).version;
  }

  const storybookPackages = await getMonorepoPackages();

  const packageToVersionMap = (
    await Promise.all(
      storybookPackages.map(async (location) => {
        const { name, version } = await readJson(join(rootDirectory, location, 'package.json'));

        return {
          name,
          version,
        };
      })
    )
  )
    .filter(({ name }) => /^(@storybook|sb$|storybook$)/.test(name))
    // As some previous steps are asynchronous order is not always the same so sort them to avoid that
    .sort((package1, package2) => package1.name.localeCompare(package2.name))
    .reduce((acc, { name }) => ({ ...acc, [name]: updatedVersion }), {});

  const versionsPath = join(__dirname, '..', 'src', 'versions.ts');

  await writeFile(
    versionsPath,
    dedent`
      // auto generated file, do not edit
      export default ${JSON.stringify(packageToVersionMap, null, 2)}
    `
  );

  logger.log(`Updating versions and formatting results at: ${versionsPath}`);

  const prettierBin = join(rootDirectory, '..', 'scripts', 'node_modules', '.bin', 'prettier');
  exec(`${prettierBin} --write ${versionsPath}`, {
    cwd: join(rootDirectory),
  });
};

run().catch((e) => {
  logger.error(e);
  process.exit(1);
});

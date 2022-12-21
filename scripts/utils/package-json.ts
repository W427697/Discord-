import { readJSON, writeJSON } from 'fs-extra';
import { join } from 'path';

const logger = console;

export async function updatePackageScripts({ cwd, prefix }: { cwd: string; prefix: string }) {
  logger.info(`🔢 Adding package scripts:`);
  const packageJsonPath = join(cwd, 'package.json');
  const packageJson = await readJSON(packageJsonPath);
  const isAngularCli = packageJson.scripts.storybook.indexOf('ng run ') !== -1;
  packageJson.scripts = {
    ...packageJson.scripts,
    storybook: isAngularCli
      ? packageJson.scripts.storybook.replace('ng run ', `${prefix} ng run `)
      : packageJson.scripts.storybook.replace(/(npx )?storybook/, `${prefix} storybook`),
    'build-storybook': isAngularCli
      ? packageJson.scripts['build-storybook'].replace('ng run ', `${prefix} ng run `)
      : packageJson.scripts['build-storybook'].replace(/(npx )?storybook/, `${prefix} storybook`),

    // See comment in combine-compodoc as to why this is necessary
    // ...(packageJson.scripts['docs:json'] && {
    //   'docs:json': 'DIR=$PWD; cd ../../scripts; yarn ts-node combine-compodoc $DIR',
    // }),
  };
  await writeJSON(packageJsonPath, packageJson, { spaces: 2 });
}

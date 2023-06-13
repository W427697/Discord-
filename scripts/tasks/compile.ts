import { readFile } from 'fs-extra';
import { resolve } from 'path';

import { maxConcurrentTasks } from '../utils/maxConcurrentTasks';
import { exec } from '../utils/exec';
import type { Task } from '../task';

export const compile: Task = {
  description: 'Compile the source code of the monorepo',
  dependsOn: ['install'],
  async ready({ codeDir }, { link }) {
    try {
      // To check if the code has been compiled as we need, we check the compiled output of
      // `@storybook/preview`. To check if it has been built for publishing (i.e. `--no-link`),
      // we check if it built types or references source files directly.
      const contents = await readFile(
        resolve(codeDir, './lib/manager-api/dist/index.d.ts'),
        'utf8'
      );

      const linkedContents = `export * from '../src/index';`;
      const isLinkedContents = contents.indexOf(linkedContents) !== -1;

      if (link) {
        return isLinkedContents;
      }
      return !isLinkedContents;
    } catch (err) {
      return false;
    }
  },
  async run({ codeDir }, { link, dryRun, debug }) {
    const command = `nx run-many --target="prep" --all`;

    const flags = link
      ? [
          `--parallel`,
          `--exclude=@storybook/addon-storyshots,@storybook/addon-storyshots-puppeteer`,
          `-- --reset`,
        ]
      : [`--parallel=8`, `-- --reset --optimized`];

    if (process.env.CI) {
      flags.push(`--max-parallel=${maxConcurrentTasks}`);
    }

    return exec(
      `${command} ${flags.join(' ')}`,
      { cwd: codeDir },
      {
        startMessage: '🥾 Bootstrapping',
        errorMessage: '❌ Failed to bootstrap',
        dryRun,
        debug,
      }
    );
  },
};

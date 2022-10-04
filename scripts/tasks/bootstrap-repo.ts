import { readFile } from 'fs-extra';
import { resolve } from 'path';

import { maxConcurrentTasks } from '../utils/maxConcurrentTasks';
import { exec } from '../utils/exec';
import type { Task } from '../task';

const linkedContents = `export * from '../../src/index';`;
const linkCommand = `nx run-many --target="prep" --all --parallel --exclude=@storybook/addon-storyshots,@storybook/addon-storyshots-puppeteer -- --reset`;
const noLinkCommand = `nx run-many --target="prep" --all --parallel=8 ${
  process.env.CI ? `--max-parallel=${maxConcurrentTasks}` : ''
} -- --reset --optimized`;

export const bootstrapRepo: Task = {
  before: ['install-repo'],
  async ready({ codeDir }, { link }) {
    const contents = await readFile(resolve(codeDir, './lib/store/dist/types/index.d.ts'), 'utf8');

    if (!contents) return false;

    if (link) return contents === linkedContents;
    return contents !== linkedContents;
  },
  async run(_, { link }) {
    return exec(
      link ? linkCommand : noLinkCommand,
      {},
      {
        startMessage: '🥾 Bootstrapping',
        errorMessage: '❌ Failed to bootstrap',
      }
    );
  },
};

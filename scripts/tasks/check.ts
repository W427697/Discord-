import type { Task } from '../task';
import { exec } from '../utils/exec';
import { maxConcurrentTasks } from '../utils/maxConcurrentTasks';

const parallel = process.env.CI ? 8 : maxConcurrentTasks;

const linkCommand = `nx affected -t check --parallel=${parallel} --exclude=angular,svelte,vue3`;
const nolinkCommand = `nx affected -t check -c production --parallel=${parallel}`;

export const check: Task = {
  description: 'Typecheck the source code of the monorepo',
  dependsOn: ['compile'],
  async ready() {
    return false;
  },
  async run({ codeDir }, { dryRun, debug, link }) {
    return exec(
      link ? linkCommand : nolinkCommand,
      { cwd: codeDir },
      {
        startMessage: '🥾 Checking for TS errors',
        errorMessage: '❌ TS errprs detected',
        dryRun,
        debug,
      }
    );
  },
};

import type { Task } from '../task';
import { exec } from '../utils/exec';
import { maxConcurrentTasks } from '../utils/maxConcurrentTasks';

// The amount of VCPUs for the check task on CI is 8 (xlarge resource)
const amountOfVCPUs = 8;

const parallel = `--parallel=${process.env.CI ? amountOfVCPUs - 1 : maxConcurrentTasks}`;

const linkCommand = `nx run-many --target="check" --all --parallel=${parallel} --exclude=@storybook/vue,@storybook/svelte,@storybook/vue3,@storybook/angular`;
const nolinkCommand = `nx run-many --target="check" --all --parallel=${parallel}`;

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
        startMessage: '🥾 Checking types validity',
        errorMessage: '❌ Unsound types detected',
        dryRun,
        debug,
      }
    );
  },
};

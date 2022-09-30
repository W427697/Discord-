import { pathExists } from 'fs-extra';
import { join } from 'path';

import type { Task } from '../task';
import { addPackageScripts, steps } from '../sandbox';
import { executeCLIStep } from '../utils/cli-step';
import { installYarn2, configureYarn2ForVerdaccio, addPackageResolutions } from '../utils/yarn';
import { exec } from '../utils/exec';

export const install: Task = {
  before: ({ link }) => (link ? ['create'] : ['run-registry-repo', 'create']),
  async ready({ sandboxDir }) {
    return pathExists(join(sandboxDir, 'node_modules'));
  },
  async run({ codeDir, sandboxDir }, { link, dryRun, debug }) {
    const cwd = sandboxDir;

    await installYarn2({ cwd, dryRun, debug });

    if (link) {
      await executeCLIStep(steps.link, {
        argument: sandboxDir,
        cwd: codeDir,
        optionValues: { local: true, start: false },
        dryRun,
        debug,
      });
    } else {
      // We need to add package resolutions to ensure that we only ever install the latest version
      // of any storybook packages as verdaccio is not able to both proxy to npm and publish over
      // the top. In theory this could mask issues where different versions cause problems.
      await addPackageResolutions({ cwd, dryRun, debug });
      await configureYarn2ForVerdaccio({ cwd, dryRun, debug });

      await exec(
        'yarn install',
        { cwd },
        {
          dryRun,
          startMessage: `⬇️ Installing local dependencies`,
          errorMessage: `🚨 Installing local dependencies failed`,
        }
      );
    }

    await addPackageScripts({
      cwd,
      scripts: {
        storybook:
          'NODE_OPTIONS="--preserve-symlinks --preserve-symlinks-main" storybook dev -p 6006',
        'build-storybook':
          'NODE_OPTIONS="--preserve-symlinks --preserve-symlinks-main" storybook build',
      },
    });
  },
};

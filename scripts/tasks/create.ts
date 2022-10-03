/* eslint-disable no-restricted-syntax, no-await-in-loop */
import { join, resolve } from 'path';
import { copy, ensureDir, existsSync, pathExists, remove } from 'fs-extra';
import dedent from 'ts-dedent';

import type { Task } from '../task';
import { forceViteRebuilds, readMainConfig, steps } from '../sandbox';
import { executeCLIStep } from '../utils/cli-step';
import { writeConfig } from '../../code/lib/csf-tools';

const reprosDir = resolve(__dirname, '../repros');

const logger = console;

export const create: Task = {
  before: ['bootstrap-repo'],
  async ready({ sandboxDir }) {
    return pathExists(sandboxDir);
  },
  async run({ key, template, sandboxDir }, { addon: addons, fromLocalRepro, dryRun, debug }) {
    if (this.ready({ sandboxDir })) {
      logger.info('🗑 Removing old sandbox dir');
      await remove(sandboxDir);
    }

    const parentDir = resolve(sandboxDir, '..');
    await ensureDir(parentDir);

    if (fromLocalRepro) {
      const srcDir = join(reprosDir, key, 'after-storybook');
      if (!existsSync(srcDir)) {
        throw new Error(dedent`
          Missing repro directory '${srcDir}'!

          To run sandbox against a local repro, you must have already generated
          the repro template in the /repros directory using:
          the repro template in the /repros directory using:

          yarn generate-repros-next --template ${key}
        `);
      }
      await copy(srcDir, sandboxDir);
    } else {
      await executeCLIStep(steps.repro, {
        argument: key,
        optionValues: { output: sandboxDir, branch: 'next' },
        cwd: parentDir,
        dryRun,
        debug,
      });
    }

    const cwd = sandboxDir;

    // TODO -- sb add <addon> doesn't actually work properly:
    //   - installs in `deps` not `devDeps`
    //   - does a `workspace:^` install (what does that mean?)
    //   - doesn't add to `main.js`

    for (const addon of addons) {
      const addonName = `@storybook/addon-${addon}`;
      await executeCLIStep(steps.add, { argument: addonName, cwd, dryRun, debug });
    }

    const mainConfig = await readMainConfig({ cwd });
    mainConfig.setFieldValue(['core', 'disableTelemetry'], true);
    if (template.expected.builder === '@storybook/builder-vite') forceViteRebuilds(mainConfig);
    await writeConfig(mainConfig);
  },
};

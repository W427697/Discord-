import { pathExists, remove } from 'fs-extra';
import { join, resolve } from 'path';
import { generate as generateRepro } from '../next-repro-generators/generate-repros';

import type { Task } from '../task';

const logger = console;
const reprosDir = resolve(__dirname, '../../repros');

export const generate: Task = {
  description: 'Create the template repro',
  dependsOn: ['run-registry'],
  async ready({ key }) {
    return pathExists(join(reprosDir, key));
  },
  async run(details) {
    const reproDir = join(reprosDir, details.key);
    if (await this.ready(details)) {
      logger.info('🗑  Removing old repro dir');
      await remove(reproDir);
    }
    await generateRepro({
      template: details.key,
      localRegistry: true,
    });
  },
};

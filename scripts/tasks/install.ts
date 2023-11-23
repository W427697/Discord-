import { pathExists, remove } from 'fs-extra';
import { join } from 'path';
import { spawn } from 'child_process';

import type { Task } from '../task';

const logger = console;

const checkDependencies = async () => {
  const scriptsPath = join(__dirname, '..');
  const codePath = join(__dirname, '..', '..', 'code');

  const tasks: any[] = [];

  if (!(await pathExists(join(scriptsPath, 'node_modules')))) {
    tasks.push(
      spawn('yarn', ['install'], {
        cwd: scriptsPath,
        shell: true,
        stdio: ['inherit', 'inherit', 'inherit'],
      })
    );
  }
  if (!(await pathExists(join(codePath, 'node_modules')))) {
    tasks.push(
      spawn('yarn', ['install'], {
        cwd: codePath,
        shell: true,
        stdio: ['inherit', 'inherit', 'inherit'],
      })
    );
  }

  if (tasks.length > 0) {
    logger.log('installing dependencies');

    await Promise.all(
      tasks.map(
        (t) =>
          new Promise<void>((res, rej) => {
            t.on('exit', (code: any) => {
              if (code !== 0) {
                rej();
              } else {
                res();
              }
            });
          })
      )
    ).catch(() => {
      tasks.forEach((t) => t.kill());
      throw new Error('Failed to install dependencies');
    });

    // give the filesystem some time
    await new Promise((res, rej) => {
      setTimeout(res, 1000);
    });
  }
};

export const install: Task = {
  description: 'Install the dependencies of the monorepo',
  async ready({ codeDir }) {
    return pathExists(join(codeDir, 'node_modules'));
  },
  async run({ codeDir }) {
    // eslint-disable-next-line global-require
    await checkDependencies();

    // these are webpack4 types, we we should never use
    await remove(join(codeDir, 'node_modules', '@types', 'webpack'));
  },
};

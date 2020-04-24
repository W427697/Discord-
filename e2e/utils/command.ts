import { spawn, SpawnOptions } from 'child_process';
// eslint-disable-next-line import/no-extraneous-dependencies
import { remove, ensureDir, pathExists } from 'fs-extra';

export const exec = async (command: string, args: string[] = [], options: SpawnOptions = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      ...options,
      stdio: 'inherit',
      shell: true,
    });

    child
      .on('close', (code) => {
        if (code) {
          reject();
        } else {
          resolve();
        }
      })
      .on('error', (e) => {
        reject();
      });
  });

export async function initDirectory(path: string): Promise<void> {
  if (await pathExists(path)) {
    await cleanDirectory(path);
  }

  return ensureDir(path);
}

export function cleanDirectory(path: string): Promise<void> {
  return remove(path);
}

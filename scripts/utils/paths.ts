/* eslint-disable no-await-in-loop, no-restricted-syntax */
import { pathExists } from '@ndelangen/fs-extra-unified';
import { join } from 'node:path';

export async function findFirstPath(paths: string[], { cwd }: { cwd: string }) {
  for (const filePath of paths) {
    if (await pathExists(join(cwd, filePath))) return filePath;
  }
  return null;
}

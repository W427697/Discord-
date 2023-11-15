/* eslint-disable no-await-in-loop, no-restricted-syntax */
import fs from 'fs-extra';
import { join } from 'path';

export async function findFirstPath(paths: string[], { cwd }: { cwd: string }) {
  for (const filePath of paths) {
    if (await fs.pathExists(join(cwd, filePath))) return filePath;
  }
  return null;
}

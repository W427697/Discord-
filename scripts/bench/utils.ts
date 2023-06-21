import { join } from 'path';
import { ensureDir, writeJSON, readJSON } from 'fs-extra';

export const now = () => new Date().getTime();

export interface SaveBenchOptions {
  rootDir?: string;
}

export const saveBench = async (data: any, options: SaveBenchOptions) => {
  const dirname = options.rootDir || process.cwd();
  const existing = await ensureDir(dirname).then(() => {
    return loadBench(options).catch(() => ({}));
  });
  await writeJSON(join(dirname, `bench.json`), { ...existing, ...data }, { spaces: 2 });
};

export const loadBench = async (options: SaveBenchOptions) => {
  const dirname = options.rootDir || process.cwd();
  return readJSON(join(dirname, `bench.json`));
};

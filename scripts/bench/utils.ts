import { join } from 'path';
import { ensureDir, writeJSON, readJSON } from 'fs-extra';

export const now = () => new Date().getTime();

export interface SaveBenchOptions {
  key: 'build' | 'dev' | 'bench-build' | 'bench-dev';
  rootDir?: string;
}

export const saveBench = async (data: any, options: SaveBenchOptions) => {
  const dirname = join(options.rootDir || process.cwd(), 'bench-results');
  await ensureDir(dirname);
  await writeJSON(join(dirname, `${options.key}.json`), data, { spaces: 2 });
};

export const loadBench = async (options: SaveBenchOptions) => {
  const dirname = join(options.rootDir || process.cwd(), 'bench-results');
  return readJSON(join(dirname, `${options.key}.json`));
};

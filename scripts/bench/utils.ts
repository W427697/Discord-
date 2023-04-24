import { join } from 'path';
import { ensureDir, writeJSON } from 'fs-extra';

export const now = () => new Date().getTime();

interface SaveBenchOptions {
  key: 'build' | 'dev' | 'bench-build' | 'bench-dev';
  rootDir?: string;
}

export const saveBench = async (data: any, options: SaveBenchOptions) => {
  console.log('save', options.key);
  const dirname = join(options.rootDir || process.cwd(), 'bench-results');
  await ensureDir(dirname);
  await writeJSON(join(dirname, `${options.key}.json`), data, { spaces: 2 });
};

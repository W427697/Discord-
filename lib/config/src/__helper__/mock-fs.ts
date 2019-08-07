import fs from 'fs';
import path from 'path';
import del from 'del';

export const testDir = '__testdir__';

const ensureDir = (k: string) => {
  const paths = k.split(path.sep);

  paths.reduce((acc, i) => {
    const current = path.join(acc, i);

    if (!fs.existsSync(current)) {
      fs.mkdirSync(current, { recursive: true });
    }

    return current;
  }, '/');
};

export const setupFs = (files: Record<string, string>) => {
  Object.entries(files).forEach(([k, v]) => {
    if (typeof v === 'string') {
      const dir = path.dirname(k);

      ensureDir(dir);

      fs.writeFileSync(k, v);
    }
    if (typeof v === 'object') {
      ensureDir(k);
    }
  });
};

export const teardown = () => {
  del.sync(`/${testDir}/`, { force: true });
};

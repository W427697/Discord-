import glob from 'glob-promise';
import { join, parse } from 'path';
import { stat, writeFile } from 'fs/promises';

const run = async ({ cwd, flags }: { cwd: string; flags: string[] }) => {
  const files = await glob(
    join(cwd, '@(lib|addons|frameworks|renderers|presets|ui)', '*', 'dist', '*.mjs')
  );

  const sizes = await Promise.all(
    files.map(async (file) => {
      const { dir } = parse(file);
      const { size } = await stat(file);
      return [dir.replace(`${cwd}/`, '').replace('/dist', ''), size];
    })
  );

  const totals = sizes.reduce(
    (acc, [dir, size]) => Object.assign(acc, { [dir]: size + (acc[dir] || 0) }),
    {}
  );

  await writeFile(join(cwd, 'stats.json'), JSON.stringify(totals, null, 2));
};

const cwd = process.cwd();
const flags = process.argv.slice(2);

run({ cwd, flags }).catch((e) => {
  console.error(e);
  process.exit(1);
});

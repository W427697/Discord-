import fs from 'fs-extra';
import { join } from 'path';
import { build } from 'tsup';

const run = async ({ cwd, flags }: { cwd: string; flags: string[] }) => {
  const packageJson = await fs.readJson(join(cwd, 'package.json'));

  await build({
    entry: packageJson.bundlerEntrypoint,
    watch: flags.includes('--watch'),
    sourcemap: flags.includes('--optimized'),
    format: ['esm', 'cjs'],
    dts: {
      entry: packageJson.bundlerEntrypoint,
      resolve: true,
    },
  });
};

const flags = process.argv.slice(2);
const cwd = process.cwd();

run({ cwd, flags }).catch((err) => {
  console.error(err.stack);
  process.exit(1);
});

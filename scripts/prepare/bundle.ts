import fs from 'fs-extra';
import { join } from 'path';
import { build } from 'tsup';

const run = async ({ cwd, flags }: { cwd: string; flags: string[] }) => {
  const packageJson = await fs.readJson(join(cwd, 'package.json'));

  if (!flags.includes('--optimized')) {
    console.log(`skipping generating types for ${process.cwd()}`);
    await fs.emptyDir(join(process.cwd(), 'dist', 'types'));
    await fs.writeFile(join(process.cwd(), 'dist', 'index.d.ts'), `export * from '../src/index';`);
  }

  await build({
    entry: packageJson.bundlerEntrypoint,
    watch: flags.includes('--watch'),
    // sourcemap: flags.includes('--optimized'),
    format: ['esm', 'cjs'],
    target: 'node16',
    clean: true,
    shims: true,

    dts: flags.includes('--optimized')
      ? {
          entry: packageJson.bundlerEntrypoint,
          resolve: true,
        }
      : false,
    esbuildOptions: (c) => {
      /* eslint-disable no-param-reassign */
      c.platform = 'node';
      c.legalComments = 'none';
      c.minifyWhitespace = !!flags.includes('--optimized');
      c.minifyIdentifiers = !!flags.includes('--optimized');
      c.minifySyntax = !!flags.includes('--optimized');
      /* eslint-enable no-param-reassign */
    },
  });
};

const flags = process.argv.slice(2);
const cwd = process.cwd();

run({ cwd, flags }).catch((err) => {
  console.error(err.stack);
  process.exit(1);
});

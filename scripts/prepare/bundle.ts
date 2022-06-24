import fs from 'fs-extra';
import path, { join } from 'path';
import { build } from 'tsup';
import aliasPlugin from 'esbuild-plugin-alias';

const hasFlag = (flags: string[], name: string) => !!flags.find((s) => s.startsWith(`--${name}`));

const run = async ({ cwd, flags }: { cwd: string; flags: string[] }) => {
  const packageJson = await fs.readJson(join(cwd, 'package.json'));

  const reset = hasFlag(flags, 'reset');
  const watch = hasFlag(flags, 'watch');
  const optimized = hasFlag(flags, 'optimized');

  if (reset) {
    await fs.emptyDir(join(process.cwd(), 'dist'));
  }

  if (!optimized) {
    console.log(`skipping generating types for ${process.cwd()}`);
    await fs.ensureFile(join(process.cwd(), 'dist', 'index.d.ts'));
    await fs.writeFile(join(process.cwd(), 'dist', 'index.d.ts'), `export * from '../src/index';`);
  }

  await Promise.all([
    build({
      entry: packageJson.bundlerEntrypoint,
      watch,
      // sourcemap: optimized,
      format: ['esm'],
      target: 'chrome100',
      clean: true,
      shims: true,
      esbuildPlugins: [
        aliasPlugin({
          process: path.resolve(
            '../../node_modules/rollup-plugin-node-polyfills/polyfills/process-es6.js'
          ),
          util: path.resolve('../../node_modules/rollup-plugin-node-polyfills/polyfills/util.js'),
        }),
      ],
      external: [
        packageJson.name,
        ...Object.keys(packageJson.dependencies || {}),
        ...Object.keys(packageJson.peerDependencies || {}),
      ],

      dts: optimized
        ? {
            entry: packageJson.bundlerEntrypoint,
            resolve: true,
          }
        : false,
      esbuildOptions: (c) => {
        /* eslint-disable no-param-reassign */
        c.define = optimized
          ? { 'process.env.NODE_ENV': "'production'", 'process.env': '{}', global: 'window' }
          : { 'process.env.NODE_ENV': "'development'", 'process.env': '{}', global: 'window' };
        c.platform = 'node';
        c.legalComments = 'none';
        c.minifyWhitespace = optimized;
        c.minifyIdentifiers = optimized;
        c.minifySyntax = optimized;
        /* eslint-enable no-param-reassign */
      },
    }),
    build({
      entry: packageJson.bundlerEntrypoint,
      watch,
      format: ['cjs'],
      target: 'node14',
      clean: true,
      external: [
        packageJson.name,
        ...Object.keys(packageJson.dependencies || {}),
        ...Object.keys(packageJson.peerDependencies || {}),
      ],

      esbuildOptions: (c) => {
        /* eslint-disable no-param-reassign */
        c.define = optimized
          ? { 'process.env.NODE_ENV': "'production'", 'process.env': '{}' }
          : { 'process.env.NODE_ENV': "'development'", 'process.env': '{}' };
        c.platform = 'node';
        c.legalComments = 'none';
        c.minifyWhitespace = optimized;
        c.minifyIdentifiers = optimized;
        c.minifySyntax = optimized;
        /* eslint-enable no-param-reassign */
      },
    }),
  ]);
};

const flags = process.argv.slice(2);
const cwd = process.cwd();

run({ cwd, flags }).catch((err) => {
  console.error(err.stack);
  process.exit(1);
});

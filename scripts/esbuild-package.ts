import path, { join, resolve } from 'path';
import { bold, gray, greenBright } from 'chalk';
import execa from 'execa';
import readPkgUp from 'read-pkg-up';

import * as tsup from 'tsup';
import fs from 'fs-extra';
import { generateDtsBundle } from 'dts-bundle-generator';
import * as dtsLozalize from './dts-localize';

async function build(options: tsup.Options) {
  await tsup.build({
    ...options,
    watch: options.watch,
    // legacyOutput: true,
    clean: true,
    shims: true,
    silent: false,

    // can't do this (YET?) presumably because of a dependency on typescript v4
    // see: https://github.com/Swatinem/rollup-plugin-dts#compatibility-notice
    dts: {
      entry: options.entry,
      resolve: true,
    },

    // we might want to use this to compile down to
    esbuildOptions: (c) => {
      /* eslint-disable no-param-reassign */
      c.legalComments = 'none';
      c.minifyWhitespace = !!options.minify;
      c.minifyIdentifiers = !!options.minify;
      c.minifySyntax = !!options.minify;
      /* eslint-enable no-param-reassign */
    },
    // onSuccess: ''
  });
}

async function dts(cwd: string, { entry, external, ...options }: tsup.Options) {
  if (options.watch) {
    try {
      const input = Array.isArray(entry) ? entry : Object.values(entry);
      const [out] = await generateDtsBundle(
        input.map((i) => {
          return {
            filePath: i,
            output: { inlineDeclareGlobals: false, sortNodes: true, noBanner: true },
          };
        }),
        { followSymlinks: false }
      );

      await fs.outputFile('dist/ts3.9/index.d.ts', out);
    } catch (e) {
      console.log(e.message);
    }
  } else {
    const input = Array.isArray(entry) ? entry : Object.values(entry);
    const [out] = await generateDtsBundle(
      input.map((i) => {
        return {
          filePath: i,
          output: { inlineDeclareGlobals: false, sortNodes: true, noBanner: true },
        };
      }),
      { followSymlinks: false }
    );

    const bundledDTSfile = path.join(cwd, 'dist/ts-tmp/index.d.ts');
    const localizedDTSout = path.join(cwd, 'dist/ts3.9');
    await fs.outputFile(bundledDTSfile, out);

    await dtsLozalize.run([bundledDTSfile], localizedDTSout, { externals: external, cwd });

    // await fs.remove(path.join(cwd, 'dist/ts-tmp'));

    await execa('node', [
      path.join(__dirname, '../node_modules/.bin/downlevel-dts'),
      'dist/ts3.9',
      'dist/ts3.4',
    ]);
  }
}

async function removeDist() {
  await fs.remove('dist');
}

export async function run({ cwd, flags }: { cwd: string; flags: string[] }) {
  const { packageJson: pkg } = await readPkgUp({ cwd });
  const message = gray(`Built: ${bold(`${pkg.name}@${pkg.version}`)}`);
  console.time(message);

  if (flags.includes('--reset')) {
    await removeDist();
  }

  const entry = (pkg.tsup.entry as string[]).map((p) => join(cwd, p));
  const external = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies });

  const options: tsup.Options = {
    ...pkg.tsup,
    external,
    entry,
    minify: flags.includes('--optimized'),
    watch: flags.includes('--watch'),
  };

  await Promise.all([
    //
    build(options),
    // dts(cwd, options),
  ]);

  console.timeEnd(message);
}

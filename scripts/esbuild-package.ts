import path, { resolve } from 'path';
import { bold, gray, greenBright } from 'chalk';
import execa from 'execa';
import readPkgUp from 'read-pkg-up';

import * as tsup from 'tsup';
import fs from 'fs-extra';
import { generateDtsBundle } from 'dts-bundle-generator';
import * as dtsLozalize from './dts-localize';

interface Options {
  input: string;
  externals: string[];
  cwd: string;
  optimized?: boolean;
  watch?: boolean;
}

async function build(options: Options) {
  await tsup.build({
    format: ['esm', 'cjs'],
    entry: [options.input],
    minify: options.optimized,
    watch: options.watch,
    external: options.externals,
    legacyOutput: true,
    clean: true,
    shims: true,
    silent: false,

    // can't do this (YET?) presumably because of a dependency on typescript v4
    // see: https://github.com/Swatinem/rollup-plugin-dts#compatibility-notice
    // dts: {
    //   entry: options.input,
    //   resolve: true,
    // },

    // we might want to use this to compile down to
    target: 'es5',
    esbuildOptions: (c) => {
      /* eslint-disable no-param-reassign */
      c.legalComments = 'none';
      c.minifyWhitespace = true;
      c.minifyIdentifiers = true;
      c.minifySyntax = true;
      /* eslint-enable no-param-reassign */
    },
    // onSuccess: ''
  });
}

async function dts({ input, externals, cwd, ...options }: Options) {
  if (options.watch) {
    try {
      const [out] = await generateDtsBundle(
        [
          {
            filePath: input,
            output: { inlineDeclareGlobals: false, sortNodes: true, noBanner: true },
          },
        ],
        { followSymlinks: false }
      );

      await fs.outputFile('dist/ts3.9/index.d.ts', out);
    } catch (e) {
      console.log(e.message);
    }
  } else {
    const [out] = await generateDtsBundle(
      [
        {
          filePath: input,
          output: { inlineDeclareGlobals: false, sortNodes: true, noBanner: true },
        },
      ],
      { followSymlinks: false }
    );

    const bundledDTSfile = path.join(cwd, 'dist/ts-tmp/index.d.ts');
    const localizedDTSout = path.join(cwd, 'dist/ts3.9');
    await fs.outputFile(bundledDTSfile, out);

    await dtsLozalize.run([bundledDTSfile], localizedDTSout, { externals, cwd });

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

  const input = path.join(cwd, pkg.bundlerEntrypoint);
  const externals = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies });

  const options: Options = {
    cwd,
    externals,
    input,
    optimized: flags.includes('--optimized'),
    watch: flags.includes('--watch'),
  };

  await Promise.all([
    //
    build(options),
    // dts(options),
  ]);

  console.timeEnd(message);
}

import { join, resolve } from 'path';
import { bold, gray, greenBright } from 'chalk';
import execa from 'execa';
import { rollup, OutputOptions, watch, RollupOptions } from 'rollup';
import readPkgUp from 'read-pkg-up';
import fs from 'fs-extra';
import rollupTypescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { babel, getBabelOutputPlugin } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import { generateDtsBundle } from 'dts-bundle-generator';
import builtins from 'builtin-modules';
import * as dtsLocalize from './localize-utils/dts-localize';

interface Options {
  input: string;
  output?: string;
  externals: string[];
  cwd: string;
  optimized?: boolean;
  watch?: boolean;
}

export async function build(options: Options, setting: RollupOptions) {
  const { cwd, optimized } = options;
  const outputs: OutputOptions[] = [
    {
      dir: resolve(cwd, './dist/modern'),
      format: 'es',
      sourcemap: optimized,
      preferConst: true,
      plugins: [
        getBabelOutputPlugin({
          compact: false,
          presets: [
            [
              '@babel/preset-env',
              {
                shippedProposals: true,
                useBuiltIns: 'usage',
                corejs: '3',
                modules: false,
                targets: { chrome: '94' },
              },
            ],
          ],
        }),
        optimized ? terser({ output: { comments: false }, module: true }) : null,
      ].filter(Boolean),
    },
    {
      dir: resolve(cwd, './dist/esm'),
      format: 'es',
      sourcemap: optimized,
      plugins: [
        getBabelOutputPlugin({
          compact: false,
          presets: [
            [
              '@babel/preset-env',
              {
                shippedProposals: true,
                useBuiltIns: 'usage',
                modules: false,
                corejs: '3',
              },
            ],
          ],
        }),
        optimized ? terser({ output: { comments: false }, module: true }) : null,
      ].filter(Boolean),
    },
    {
      dir: resolve(cwd, './dist/cjs'),
      format: 'commonjs',

      plugins: [
        getBabelOutputPlugin({
          compact: false,
          presets: [
            [
              '@babel/preset-env',
              {
                shippedProposals: true,
                useBuiltIns: 'usage',
                corejs: '3',
                modules: false,
                targets: { node: '14' },
              },
            ],
          ],
        }),
        optimized ? terser({ output: { comments: false }, module: true }) : null,
      ].filter(Boolean),
    },
  ];

  if (options.watch) {
    const watcher = watch({ ...setting, output: outputs });

    watcher.on('change', (event) => {
      console.log(`${greenBright('changed')}: ${event.replace(resolve(cwd, '../..'), '.')}`);

      dts(options);
    });
  } else {
    const bundler = await rollup(setting);

    await outputs.reduce(async (acc, config) => {
      await acc;
      await bundler.write(config);
      console.log(`${bold('bundled')}: ${config.dir.replace(cwd, '.')}`);
    }, Promise.resolve());

    await bundler.close();
  }
}

export async function dts({ input, externals, cwd, ...options }: Options) {
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

    if (options.optimized) {
      const bundledDTSfile = join(cwd, 'dist/ts-tmp/index.d.ts');
      const localizedDTSout = join(cwd, 'dist/ts3.9');
      await fs.outputFile(bundledDTSfile, out);
      console.log(`${bold('bundled')}: ${bundledDTSfile.replace(cwd, '.')}`);

      await dtsLocalize.run([bundledDTSfile], localizedDTSout, { externals, cwd });
      console.log(`${bold('localized')}: ${localizedDTSout.replace(cwd, '.')}`);

      await fs.remove(join(cwd, 'dist/ts-tmp'));

      await execa('node', [
        join(__dirname, '../node_modules/.bin/downlevel-dts'),
        'dist/ts3.9',
        'dist/ts3.4',
      ]);
      console.log(`${bold('ported')}: ${localizedDTSout.replace(cwd, '.')}`);
    } else {
      const bundledDTSfile = join(cwd, 'dist/ts3.9/index.d.ts');
      await fs.outputFile(bundledDTSfile, out);
      console.log(`${bold('bundled')}: ${bundledDTSfile.replace(cwd, '.')}`);
    }
  }
}

export async function removeDist() {
  await fs.remove('dist');
}

export async function run({ cwd, flags }: { cwd: string; flags: string[] }) {
  if (flags.includes('--reset')) {
    await removeDist();
  }
  const { packageJson: pkg } = await readPkgUp({ cwd });

  const message = gray(`Built: ${bold(`${pkg.name}@${pkg.version}`)}`);
  console.time(message);

  const input = join(cwd, pkg.bundlerEntrypoint);
  const externals = [...Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies }), ...builtins];

  const options: Options = {
    cwd,
    externals,
    input,
    optimized: flags.includes('--optimized'),
    watch: flags.includes('--watch'),
  };

  await build(options, {
    input,
    external: externals,
    treeshake: {
      preset: 'safest',
    },
    plugins: [
      nodeResolve({
        browser: true,
        preferBuiltins: true,
      }),
      commonjs({
        ignoreGlobal: true,
      }),
      babel({
        compact: false,
        babelHelpers: 'external',
        skipPreflightCheck: true,
      }),
      json(),
      rollupTypescript({ lib: ['es2015', 'dom', 'esnext'], target: 'es6' }),
    ],
  });

  await dts(options);

  console.timeEnd(message);
}

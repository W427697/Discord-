import { join } from 'path';
import { build } from 'tsup';
import { readFile } from 'fs/promises';
import { emptyDir } from 'fs-extra';
import type { PackageJson } from 'type-fest';

import { globalPackages as globalManagerPackages } from '../../code/core/main/src/modules/manager/globals';
import { globalPackages as globalPreviewPackages } from '../../code/core/main/src/modules/preview/globals';
import {
  hasFlag,
  getOptionsArray,
  getBaseOptions,
  mergeOptions,
  generateDTSMapperFile,
  updatePackageJson,
  nodeBuildIn,
} from './utils/utils';

export type Flags = {
  watch: boolean;
  optimized: boolean;
  reset: boolean;
  cwd: string;
};

/* MAIN */

const run = async ({ cwd, flags }: { cwd: string; flags: string[] }) => {
  const reset = hasFlag(flags, 'reset');
  const watch = hasFlag(flags, 'watch');
  const optimized = hasFlag(flags, 'optimized');

  const utils = Promise.all([
    import(join(cwd, 'tsup.config.ts')).then((m) =>
      getOptionsArray(m.default.default || m.default)
    ),
    getBaseOptions({ watch, optimized, cwd, reset }),
    readFile(join(cwd, 'package.json'), 'utf-8').then(
      (s) => JSON.parse(s) as PackageJson.PackageJsonStandard
    ),
  ]);

  if (reset) {
    await emptyDir(join(process.cwd(), 'dist'));
  }

  const [configs, getter, pkg] = await utils;

  const tasks = [];

  if (configs.length < 1) {
    throw new Error('No tsup-configs found');
  }

  // if watch, instead of using native watch, use chokidar + https://esbuild.github.io/api/#rebuild

  tasks.push(
    ...configs.map((config) => {
      const format = config.format;
      if (Array.isArray(format)) {
        throw new Error('format must be a string');
      }
      return build(mergeOptions({ config, ...getter(format) }));
    })
  );

  const entries = configs.flatMap(({ entry, format: formatRaw }) => {
    if (!entry) {
      return [];
    }
    return [...(Array.isArray(entry) ? entry : Object.values(entry))].flatMap((file) =>
      [].concat(formatRaw).map((format) => ({ file, format }))
    );
  });

  if (!optimized) {
    tasks.push(...entries.map(({ file }) => generateDTSMapperFile(file)));
  }

  tasks.push(
    updatePackageJson(
      pkg,
      [
        ...entries,
        {
          file: './src/modules/blocks/index.ts',
          format: 'esm',
        },
        {
          file: './src/modules/components/index.ts',
          format: 'esm',
        },
        {
          file: './src/modules/blocks/index.ts',
          format: 'cjs',
        },
        {
          file: './src/modules/components/index.ts',
          format: 'cjs',
        },
        {
          file: './src/prebuild/manager/runtime.ts',
          format: 'iife',
        },
        {
          file: './src/prebuild/manager/globals-runtime.ts',
          format: 'iife',
        },
        {
          file: './src/prebuild/preview/globals-runtime.ts',
          format: 'iife',
        },
      ],
      cwd
    )
  );

  tasks.push(
    ...[
      './src/modules/blocks/index.ts',
      './src/modules/components/index.ts',
      './src/prebuild/manager/runtime.ts',
      './src/prebuild/manager/globals-runtime.ts',
      './src/prebuild/preview/globals-runtime.ts',
    ].map(async (file) => generateDTSMapperFile(file))
  );

  await Promise.all(tasks);

  const unique = [];

  unique.push(
    build(
      mergeOptions({
        config: {
          entry: [
            './src/modules/manager/runtime.ts',
            './src/modules/manager/globals-runtime.ts',
            './src/modules/preview/globals-runtime.ts',
          ],
          format: 'esm',
          external: [],
          outDir: join(cwd, 'dist/prebuild'),
          outExtension: () => ({
            js: '.js',
          }),
          esbuildOptions: (c) =>
            Object.assign(c, {
              outbase: './src/modules/',
              logLevel: 'error',
              legalComments: 'none',
              minifyWhitespace: optimized,
              minifyIdentifiers: false,
              minifySyntax: optimized,
              conditions: ['browser', 'module'],
            }),
          target: ['chrome100', 'safari15', 'firefox91'],
        },
        ...getter('esm'),
      })
    )
  );

  unique.push(
    build(
      mergeOptions({
        config: {
          entry: ['./src/modules/blocks/index.ts'],
          format: 'esm',
          external: ['react', 'react-dom', '@storybook/core', ...globalPreviewPackages],
          outDir: join(cwd, 'dist'),
          target: ['chrome100', 'safari15', 'firefox91'],
        },
        ...getter('esm'),
      })
    )
  );

  unique.push(
    build(
      mergeOptions({
        config: {
          entry: ['./src/modules/blocks/index.ts'],
          format: 'cjs',
          external: [
            'react',
            'react-dom',
            '@storybook/core',
            ...nodeBuildIn,
            ...globalPreviewPackages,
          ],
          outDir: join(cwd, 'dist'),
          target: ['node18'],
        },
        ...getter('cjs'),
      })
    )
  );

  unique.push(
    build(
      mergeOptions({
        config: {
          entry: ['./src/modules/components/index.ts'],
          format: ['esm'],
          external: ['react', 'react-dom', '@storybook/core', ...globalManagerPackages],
          outDir: join(cwd, 'dist'),
          target: ['chrome100', 'safari15', 'firefox91'],
        },
        ...getter('esm'),
      })
    )
  );

  unique.push(
    build(
      mergeOptions({
        config: {
          entry: ['./src/modules/components/index.ts'],
          format: ['cjs'],
          external: [
            'react',
            'react-dom',
            '@storybook/core',
            ...nodeBuildIn,
            ...globalManagerPackages,
          ],
          outDir: join(cwd, 'dist'),

          target: ['node18'],
        },
        ...getter('cjs'),
      })
    )
  );

  unique.push(
    build(
      mergeOptions({
        config: {
          entry: ['./src/modules/core-server/presets/common-manager.ts'],
          format: 'esm',
          external: [...globalManagerPackages],
          outDir: join(cwd, 'dist'),
          target: ['chrome100', 'safari15', 'firefox91'],
        },
        ...getter('esm'),
      })
    )
  );

  await Promise.all(unique);

  if (process.env.CI !== 'true') {
    console.log('done');
  }
};

/* SELF EXECUTION */

const flags = process.argv.slice(2);
const cwd = process.cwd();

run({ cwd, flags }).catch((err: unknown) => {
  // We can't let the stack try to print, it crashes in a way that sets the exit code to 0.
  // Seems to have something to do with running JSON.parse() on binary / base64 encoded sourcemaps
  // in @cspotcode/source-map-support
  if (err instanceof Error) {
    console.error(err.stack);
  }
  process.exit(1);
});

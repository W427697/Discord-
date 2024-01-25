import { dirname, join, parse, posix, relative, sep } from 'path';
import type { Options, defineConfig } from 'tsup';
import dedent from 'ts-dedent';
import { writeFile } from 'fs/promises';
import { ensureFile } from 'fs-extra';
import sortPkg from 'sort-package-json';
import type { PackageJson } from 'type-fest';
import aliasPlugin from 'esbuild-plugin-alias';
import type { Flags } from '../core-bundle';

/* UTILS */
export async function getOptionsArray(config: ReturnType<typeof defineConfig>): Promise<Options[]> {
  const list = [];
  if (Array.isArray(config)) {
    list.push(...config);
  } else if (typeof config === 'object') {
    list.push(config);
  } else if (typeof config === 'function') {
    list.push(...[].concat(await config({})));
  }

  return list;
}
export async function getBaseOptions({
  watch,
  optimized,
  cwd,
}: Flags): Promise<(format: string) => { defaults: Options; overrides: Options }> {
  return (format) => ({
    defaults: {
      treeshake: true,
      sourcemap: false,
      shims: false,
      splitting: true,

      external: format.match('esm') ? ['@storybook/core'] : ['@storybook/core', ...nodeBuildIn],

      outDir: join(cwd, 'dist'),
      esbuildOptions: (c) =>
        Object.assign(c, {
          outbase: join(cwd, 'src'),
          logLevel: 'error',
          legalComments: 'none',
          minifyWhitespace: optimized,
          minifyIdentifiers: false,
          minifySyntax: optimized,
          conditions: format.match('esm') ? ['browser', 'module'] : ['node', 'module', 'require'],
        }),
      ...(format.match('esm')
        ? {
            esbuildPlugins: [
              aliasPlugin({
                process: require.resolve('process/browser.js'),
                util: require.resolve('util/util.js'),
                assert: require.resolve('browser-assert'),
              }),
            ],
          }
        : {}),

      define: {
        'process.env.NODE_ENV': '"production"',
        'process.env.NODE_DEBUG': '""',
        'process.env.FORCE_SIMILAR_INSTEAD_OF_MAP': '"false"',
      },
    },
    overrides: {
      silent: !watch,
      watch: !!watch,
      clean: false,
      config: false,
    },
  });
}
export function mergeOptions({
  config,
  overrides,
  defaults,
}: {
  config: Options;
  overrides: Options;
  defaults: Options;
}): Options {
  return {
    ...defaults,
    ...config,
    ...overrides,
  };
}
export async function generateDTSMapperFile(file: string) {
  const { name: entryName, dir, base } = parse(file);

  const pathName = join(process.cwd(), dir.replace('./src', './dist'), `${entryName}.d.ts`);
  const srcName = join(process.cwd(), dir, base);
  const rel = relative(dirname(pathName), dirname(srcName)).split(sep).join(posix.sep);

  await ensureFile(pathName);
  await writeFile(
    pathName,
    dedent`
      // generated type definitions for dev-mode
      export * from '${rel}/${base}';
    `,
    { encoding: 'utf-8' }
  );
}
export const hasFlag = (flags: string[], name: string) =>
  !!flags.find((s) => s.startsWith(`--${name}`));
const formatToType: Record<string, string> = {
  cjs: 'require',
  esm: 'module',
  iife: 'module',
};
const formatToExt: Record<string, string> = {
  cjs: '.js',
  esm: '.mjs',
  iife: '.js',
};
export const nodeBuildIn = [
  'assert',
  'buffer',
  'child_process',
  'cluster',
  'crypto',
  'dgram',
  'dns',
  'domain',
  'events',
  'fs',
  'http',
  'https',
  'net',
  'os',
  'path',
  'punycode',
  'querystring',
  'readline',
  'stream',
  'string_decoder',
  'tls',
  'tty',
  'url',
  'util',
  'v8',
  'vm',
  'zlib',
].flatMap((name) => [name, `node:${name}`]);
export async function updatePackageJson(
  pkg: PackageJson.PackageJsonStandard,
  entries: Record<string, string>[],
  cwd: string
) {
  const grouped = entries.reduce<Record<string, Record<string, string>>>(
    (acc, { file, format }) => {
      const type = formatToType[format];
      if (!type) {
        return acc;
      }

      const { dir, name } = parse(file);
      const key = `./${join(dir.replace('./src', './dist'), name)}`;
      acc[key] = acc[key] || {
        types: `${key}.d.ts`,
      };
      acc[key][type] = `${key}${formatToExt[format]}`;
      return acc;
    },
    {}
  );

  if (
    (typeof pkg.exports === 'object' && !Array.isArray(pkg.exports)) ||
    pkg.exports === undefined
  ) {
    pkg.exports = {
      './package.json': './package.json',
      // ...(pkg.exports as any),
      ...grouped,
    };
    await writeFile(join(cwd, 'package.json'), `${JSON.stringify(sortPkg(pkg), null, 2)}\n`);
  }
}

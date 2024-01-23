import { dirname, join, parse, posix, relative, sep } from 'path';
import type { Options, defineConfig } from 'tsup';
import { build } from 'tsup';
import dedent from 'ts-dedent';
import { readFile, writeFile } from 'fs/promises';
import { emptyDir, ensureFile } from 'fs-extra';
import sortPkg from 'sort-package-json';
import type { PackageJson } from 'type-fest';

type Flags = {
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

  const [configs, { defaults, overrides }, pkg] = await utils;

  const tasks = [];

  if (configs.length < 1) {
    throw new Error('No tsup-configs found');
  }

  tasks.push(...configs.map((config) => build(mergeOptions({ config, overrides, defaults }))));

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

  tasks.push(updatePackageJson(pkg, entries));

  await Promise.all(tasks);

  if (process.env.CI !== 'true') {
    console.log('done');
  }
};

/* UTILS */

async function getOptionsArray(config: ReturnType<typeof defineConfig>): Promise<Options[]> {
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

async function getBaseOptions({
  watch,
  optimized,
  cwd,
}: Flags): Promise<{ defaults: Options; overrides: Options }> {
  return {
    defaults: {
      silent: !watch,
      treeshake: true,
      sourcemap: false,
      shims: false,

      outDir: join(cwd, 'dist'),
      esbuildOptions: (c) =>
        Object.assign(c, {
          outbase: join(cwd, 'src'),
          logLevel: 'error',
          legalComments: 'none',
          minifyWhitespace: optimized,
          minifyIdentifiers: false,
          minifySyntax: optimized,
        }),
      target: ['chrome100', 'safari15', 'firefox91'],
    },
    overrides: {
      watch: !!watch,
      // clean: !!reset,
    },
  };
}

function mergeOptions({
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

async function generateDTSMapperFile(file: string) {
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

const hasFlag = (flags: string[], name: string) => !!flags.find((s) => s.startsWith(`--${name}`));

const formatToType: Record<string, string> = {
  cjs: 'require',
  esm: 'module',
};
const formatToExt: Record<string, string> = {
  cjs: '.js',
  esm: '.mjs',
};

async function updatePackageJson(
  pkg: PackageJson.PackageJsonStandard,
  entries: Record<string, string>[]
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
      ...(pkg.exports as any),
      ...grouped,
    };
    await writeFile(join(cwd, 'package.json'), `${JSON.stringify(sortPkg(pkg), null, 2)}\n`);
  }
}

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

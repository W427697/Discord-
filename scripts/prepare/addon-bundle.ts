#!/usr/bin/env ../../node_modules/.bin/ts-node

import * as fs from 'fs-extra';
import path, { join, dirname, relative } from 'path';
import type { PackageJson } from 'type-fest';
import { build } from 'tsup';
import aliasPlugin from 'esbuild-plugin-alias';
import { globalExternals } from '@fal-works/esbuild-plugin-global-externals';

import slash from 'slash';
import type { Options } from 'tsup';
import dedent from 'ts-dedent';
import { exec } from '../utils/exec';

import { definitions as previewGlobalsDefinitions } from '../../code/lib/preview/src/globals/definitions';
import { definitions as managerGlobalsDefinitions } from '../../code/ui/manager/src/globals/definitions';

/* TYPES */

type Formats = 'esm' | 'cjs';
type BundlerConfig = {
  browserEntries: string[];
  nodeEntries: string[];
  interfaceEntries: string[];
  externals: string[];
  platform: Options['platform'];
  pre: string;
  post: string;
  formats: Formats[];
};
type PackageJsonWithBundlerConfig = PackageJson & {
  bundler: BundlerConfig;
};
type DtsConfigSection = Pick<Options, 'dts' | 'tsconfig'>;

/* MAIN */

const run = async ({ cwd, flags }: { cwd: string; flags: string[] }) => {
  const {
    name,
    dependencies,
    peerDependencies,
    bundler: {
      browserEntries = [],
      nodeEntries = [],
      externals: extraExternals = [],
      interfaceEntries = [],
      pre,
      post,
    },
  } = (await fs.readJson(join(cwd, 'package.json'))) as PackageJsonWithBundlerConfig;

  const reset = hasFlag(flags, 'reset');
  const watch = hasFlag(flags, 'watch');
  const optimized = hasFlag(flags, 'optimized');
  const globals: Parameters<typeof globalExternals>[0] = {
    ...managerGlobalsDefinitions,
    ...previewGlobalsDefinitions,
  };

  if (reset) {
    await fs.emptyDir(join(process.cwd(), 'dist'));
  }

  if (pre) {
    await exec(`node -r ${__dirname}/../node_modules/esbuild-register/register.js ${pre}`, { cwd });
  }

  const tasks: Promise<any>[] = [];

  const outDir = join(process.cwd(), 'dist');
  const externals = [
    name,
    ...extraExternals,
    ...Object.keys(dependencies || {}),
    ...Object.keys(peerDependencies || {}),
  ];

  if (interfaceEntries.length > 0) {
    const { dtsConfig, tsConfigExists } = await getDTSConfigs({
      entries: interfaceEntries,
    });

    tasks.push(
      build({
        silent: true,
        treeshake: true,
        entry: interfaceEntries,
        shims: false,
        watch,
        outDir,
        format: ['esm'],
        target: 'chrome100',
        clean: false,
        ...(optimized ? dtsConfig : {}),
        platform: 'browser',
        esbuildPlugins: [
          aliasPlugin({
            process: require.resolve('../node_modules/process/browser.js'),
            util: require.resolve('../node_modules/util/util.js'),
            assert: require.resolve('browser-assert'),
          }),
          globalExternals(globals),
        ],
        // noExternal: deps,
        external: externals,

        esbuildOptions: (c) => {
          /* eslint-disable no-param-reassign */
          c.conditions = ['module'];
          c.platform = 'browser';
          Object.assign(c, getESBuildOptions(optimized));
          /* eslint-enable no-param-reassign */
        },
      })
    );
    tasks.push(
      build({
        silent: true,
        treeshake: true,
        entry: interfaceEntries,
        shims: false,
        watch,
        outDir,
        format: ['cjs'],
        target: 'node16',
        clean: false,
        ...(optimized ? dtsConfig : {}),
        platform: 'node',
        external: externals,

        esbuildOptions: (c) => {
          /* eslint-disable no-param-reassign */
          c.conditions = ['module'];
          c.platform = 'node';
          Object.assign(c, getESBuildOptions(optimized));
          /* eslint-enable no-param-reassign */
        },
      })
    );

    if (tsConfigExists && !optimized) {
      tasks.push(...interfaceEntries.map(generateDTSMapperFile));
    }
  }

  if (browserEntries.length > 0) {
    const allEntries = browserEntries.map((e: string) => slash(join(cwd, e)));

    tasks.push(
      build({
        silent: true,
        entry: allEntries,
        treeshake: true,
        watch,
        outDir,
        outExtension: () => ({
          js: '.js',
        }),
        format: ['esm'],
        target: 'chrome100',
        clean: false,
        platform: 'browser',
        esbuildPlugins: [
          aliasPlugin({
            process: require.resolve('../node_modules/process/browser.js'),
            util: require.resolve('../node_modules/util/util.js'),
            assert: require.resolve('browser-assert'),
          }),
          globalExternals(globals),
        ],
        external: externals,

        esbuildOptions: (c) => {
          /* eslint-disable no-param-reassign */
          c.conditions = ['module'];
          c.platform = 'browser';
          Object.assign(c, getESBuildOptions(optimized));
          /* eslint-enable no-param-reassign */
        },
      })
    );
  }

  if (nodeEntries.length > 0) {
    const allEntries = nodeEntries.map((e: string) => slash(join(cwd, e)));

    tasks.push(
      build({
        silent: true,
        entry: allEntries,
        watch,
        outDir,
        format: ['cjs'],
        target: 'node16',
        clean: false,
        platform: 'node',
        esbuildPlugins: [
          aliasPlugin({
            process: require.resolve('../node_modules/process/browser.js'),
            util: require.resolve('../node_modules/util/util.js'),
          }),
        ],
        external: externals,

        esbuildOptions: (c) => {
          /* eslint-disable no-param-reassign */
          c.platform = 'node';
          Object.assign(c, getESBuildOptions(optimized));
          /* eslint-enable no-param-reassign */
        },
      })
    );
  }

  await Promise.all(tasks);

  if (post) {
    await exec(
      `node -r ${__dirname}/../node_modules/esbuild-register/register.js ${post}`,
      { cwd },
      { debug: true }
    );
  }

  console.log('done');
};

/* UTILS */

async function getDTSConfigs({ entries }: { entries: string[] }) {
  const tsConfigPath = join(cwd, 'tsconfig.json');
  const tsConfigExists = await fs.pathExists(tsConfigPath);

  const dtsConfig: DtsConfigSection = {
    tsconfig: tsConfigPath,
    dts: {
      entry: entries,
      resolve: true,
    },
  };

  return { dtsConfig, tsConfigExists };
}

function getESBuildOptions(optimized: boolean) {
  return {
    logLevel: 'error',
    legalComments: 'none',
    minifyWhitespace: optimized,
    minifyIdentifiers: false,
    minifySyntax: optimized,
  };
}

async function generateDTSMapperFile(file: string) {
  const { name: entryName, dir } = path.parse(file);

  const pathName = join(process.cwd(), dir.replace('./src', 'dist'), `${entryName}.d.ts`);
  const srcName = join(process.cwd(), file);
  const rel = relative(dirname(pathName), dirname(srcName)).split(path.sep).join(path.posix.sep);

  await fs.ensureFile(pathName);
  await fs.writeFile(
    pathName,
    dedent`
      // dev-mode
      export * from '${rel}/${entryName}';
    `,
    { encoding: 'utf-8' }
  );
}

const hasFlag = (flags: string[], name: string) => !!flags.find((s) => s.startsWith(`--${name}`));

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

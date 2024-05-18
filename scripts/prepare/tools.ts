import { dirname, join } from 'node:path';
import * as process from 'node:process';
import { glob } from 'glob';
import Bun from 'bun';

import slash from 'slash';

import * as rpd from 'rollup-plugin-dts';
import * as rollup from 'rollup';

export const dts = async (entry: string, externals: string[], tsconfig: string) => {
  console.log(entry);
  const dir = dirname(entry).replace('src', 'dist');
  const out = await rollup.rollup({
    input: entry,
    external: [...externals, 'ast-types'].map((dep) => new RegExp(`^${dep}($|\\/|\\\\)`)),
    output: { file: entry.replace('src', 'dist').replace('.ts', '.d.ts'), format: 'es' },
    plugins: [
      rpd.dts({
        respectExternal: true,
        tsconfig,
        compilerOptions: {
          esModuleInterop: true,
          baseUrl: '.',
          declaration: true,
          noEmit: false,
          emitDeclarationOnly: true,
          noEmitOnError: true,
          checkJs: false,
          declarationMap: false,
          skipLibCheck: true,
          preserveSymlinks: false,
          target: ts.ScriptTarget.ESNext,
        },
      }),
    ],
  });
  const { output } = await out.generate({
    format: 'es',
    // dir: dirname(entry).replace('src', 'dist'),
    file: entry.replace('src', 'dist').replace('.ts', '.d.ts'),
  });

  await Promise.all(
    output.map(async (o) => {
      if (o.type === 'chunk') {
        await Bun.write(join(dir, o.fileName), o.code);
      } else {
        throw new Error(`Unexpected output type: ${o.type} for ${entry} (${o.fileName})`);
      }
    })
  );
};

import typescript from 'typescript';
import sortPackageJson from 'sort-package-json';
import * as tsup from 'tsup';
import * as esbuild from 'esbuild';
import type * as typefest from 'type-fest';
import prettyTime from 'pretty-hrtime';
import * as prettier from 'prettier';
import chalk from 'chalk';
import { dedent } from 'ts-dedent';
import limit from 'p-limit';
import { CODE_DIRECTORY } from '../utils/constants';
import ts from 'typescript';

export const defineEntry =
  (cwd: string) =>
  (
    entry: string,
    targets: ('node' | 'browser')[],
    generateDTS: boolean = true,
    externals: string[] = []
  ) => ({
    file: slash(join(cwd, entry)),
    node: targets.includes('node'),
    browser: targets.includes('browser'),
    dts: generateDTS,
    externals,
  });

export const merge = <T extends Record<string, any>>(...objects: T[]): T =>
  Object.assign({}, ...objects);

export const measure = async (fn: () => Promise<void>) => {
  const start = process.hrtime();
  await fn();
  return process.hrtime(start);
};

export {
  typescript,
  tsup,
  typefest,
  process,
  esbuild,
  prettyTime,
  chalk,
  dedent,
  limit,
  sortPackageJson,
  prettier,
  Bun,
};

export const nodeInternals = [
  ...require('module').builtinModules.flatMap((m: string) => [m, `node:${m}`]),
];

export const getWorkspace = async () => {
  const codePackage = await Bun.file(join(CODE_DIRECTORY, 'package.json')).json();
  const {
    workspaces: { packages: patterns },
  } = codePackage;

  const workspaces = await Promise.all(
    (patterns as string[]).map(async (pattern: string) => glob(pattern, { cwd: CODE_DIRECTORY }))
  );

  return Promise.all(
    workspaces
      .flatMap((p) => p.map((i) => join(CODE_DIRECTORY, i)))
      .map(async (p) => {
        const pkg = await Bun.file(join(p, 'package.json')).json();
        return { ...pkg, path: p } as typefest.PackageJson &
          Required<Pick<typefest.PackageJson, 'name' | 'version'>> & { path: string };
      })
  );
};

import { join } from 'node:path';
import * as process from 'node:process';
import { readFile } from 'node:fs/promises';
import { glob } from 'glob';
import Bun from 'bun';

import slash from 'slash';

import typescript from 'typescript';
import sortPackageJson from 'sort-package-json';
import * as tsmorph from 'ts-morph';
import * as tsup from 'tsup';
import * as esbuild from 'esbuild';
import type * as typefest from 'type-fest';
import * as dts from 'dts-bundle-generator';
import prettyTime from 'pretty-hrtime';
import * as prettier from 'prettier';
import chalk from 'chalk';
import { dedent } from 'ts-dedent';
import limit from 'p-limit';
import { CODE_DIRECTORY } from '../utils/constants';

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
  tsmorph,
  tsup,
  typefest,
  process,
  esbuild,
  dts,
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

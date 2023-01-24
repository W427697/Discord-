import { join } from 'node:path';
import { hrtime } from 'node:process';
import { init, parse } from 'es-module-lexer';
import MagicString from 'magic-string';
import { emptyDir, ensureDir, ensureFile, writeFile } from 'fs-extra';
import { mergeAlias } from 'vite';
import type { Alias, Plugin } from 'vite';
import { globals } from '@storybook/preview/globals';

type SingleGlobalName = keyof typeof globals;
type Globals = typeof globals & Record<string, string>;

const replacementMap = new Map([
  ['import ', 'const '],
  ['import{', 'const {'],
  [' as ', ': '],
  [' from ', ' = '],
  ['}from', '} ='],
]);

/**
 * This plugin swaps out imports of pre-bundled storybook preview modules for destructures from global
 * variables that are added in runtime.mjs.
 *
 * For instance:
 *
 * ```js
 * import { useMemo as useMemo2, useEffect as useEffect2 } from "@storybook/preview-api";
 * ```
 *
 * becomes
 *
 * ```js
 * const { useMemo: useMemo2, useEffect: useEffect2 } = __STORYBOOK_MODULE_PREVIEW_API__;
 * ```
 *
 * It is based on existing plugins like https://github.com/crcong/vite-plugin-externals
 * and https://github.com/eight04/rollup-plugin-external-globals, but simplified to meet our simple needs.
 */
export async function externalsPlugin() {
  await init;
  let configTiming = BigInt(0);
  let transformTiming = BigInt(0);
  return {
    name: 'storybook:externals-plugin',
    enforce: 'post',
    // In dev (serve), we set up aliases to files that we write into node_modules/.cache.
    async config(config, { command }) {
      const startTime = hrtime.bigint();
      if (command !== 'serve') {
        return undefined;
      }
      const newAlias = mergeAlias([], config.resolve?.alias) as Alias[];

      const cachePath = join(process.cwd(), 'node_modules', '.cache', 'vite-plugin-externals');
      await ensureDir(cachePath);
      await emptyDir(cachePath);
      await Promise.all(
        (Object.keys(globals) as Array<keyof typeof globals>).map(async (externalKey) => {
          const externalCachePath = join(cachePath, `${externalKey}.js`);
          newAlias.push({ find: new RegExp(`^${externalKey}$`), replacement: externalCachePath });
          await ensureFile(externalCachePath);
          await writeFile(externalCachePath, `module.exports = ${globals[externalKey]};`);
        })
      );
      const endTime = hrtime.bigint();
      configTiming += endTime - startTime;

      return {
        resolve: {
          alias: newAlias,
        },
      };
    },
    // Replace imports with variables destructured from global scope
    async transform(code: string, id: string) {
      const startTime = hrtime.bigint();

      const globalsList = Object.keys(globals) as SingleGlobalName[];
      if (globalsList.every((glob) => !code.includes(glob))) return undefined;

      const [imports] = parse(code);
      const src = new MagicString(code);
      imports.forEach(({ n: path, ss: startPosition, se: endPosition }) => {
        const packageName = path as SingleGlobalName | undefined;
        if (packageName && globalsList.includes(packageName)) {
          const importStatement = src.slice(startPosition, endPosition);
          const transformedImport = rewriteImport(importStatement, globals, packageName);
          src.update(startPosition, endPosition, transformedImport);
        }
      });

      const endTime = hrtime.bigint();
      transformTiming += endTime - startTime;

      return {
        code: src.toString(),
        map: src.generateMap({
          source: id,
          includeContent: true,
          hires: true,
        }),
      };
    },
    configResolved() {
      console.log({
        configTiming: `${Number(configTiming) / 1000000000} sec`,
      });
    },
    buildEnd() {
      console.log({
        transformTiming: `${Number(transformTiming) / 1000000000} sec`,
      });
    },
  } satisfies Plugin;
}

export function rewriteImport<T = true>(
  importStatement: string,
  globs: T extends true ? Globals : Record<string, string>,
  packageName: keyof typeof globs & string
): string {
  const lookup = [
    ...replacementMap.keys(),
    `.${packageName}.`,
    `await import\\(.${packageName}.\\)`,
  ];
  const search = new RegExp(`(${lookup.join('|')})`, 'g');
  return importStatement.replace(
    search,
    (match) => replacementMap.get(match) ?? globs[packageName]
  );
}

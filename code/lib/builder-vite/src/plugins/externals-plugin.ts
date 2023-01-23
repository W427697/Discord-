import { join } from 'node:path';
import { init, parse } from 'es-module-lexer';
import MagicString from 'magic-string';
import { emptyDirSync, ensureDir, ensureFile, writeFile } from 'fs-extra';
import { mergeAlias } from 'vite';
import type { Alias, Plugin } from 'vite';
import { globals } from '@storybook/preview/globals';

type SingleGlobalName = keyof typeof globals;

export async function externalsPlugin() {
  await init;
  return {
    name: 'storybook:externals-plugin',
    enforce: 'post',
    async config(config, { command }) {
      if (command !== 'serve') {
        return undefined;
      }
      const newAlias = mergeAlias([], config.resolve?.alias) as Alias[];

      const cachePath = join(process.cwd(), 'node_modules', '.cache', 'vite-plugin-externals');
      await ensureDir(cachePath);
      await emptyDirSync(cachePath);

      // eslint-disable-next-line no-restricted-syntax
      for await (const externalKey of Object.keys(globals) as Array<keyof typeof globals>) {
        const externalCachePath = join(cachePath, `${externalKey}.js`);
        newAlias.push({ find: new RegExp(`^${externalKey}$`), replacement: externalCachePath });
        await ensureFile(externalCachePath);
        await writeFile(externalCachePath, `module.exports = ${globals[externalKey]};`);
      }

      return {
        resolve: {
          alias: newAlias,
        },
      };
    },
    async transform(code: string, id: string) {
      const globalsList = Object.keys(globals) as SingleGlobalName[];
      if (globalsList.every((glob) => !code.includes(glob))) return undefined;

      const [imports] = parse(code);
      const src = new MagicString(code);
      imports.forEach(({ n: path, ss: startPosition, se: endPosition }) => {
        const packageName = path as SingleGlobalName | undefined;
        const packageAndDelimiters = new RegExp(`.${packageName}.`);
        if (packageName && globalsList.includes(packageName)) {
          src.update(
            startPosition,
            endPosition,
            src
              .slice(startPosition, endPosition)
              .replace('import ', 'const ')
              .replaceAll(' as ', ': ')
              .replace(' from ', ' = ')
              .replace(packageAndDelimiters, globals[packageName])
          );
        }
      });

      return {
        code: src.toString(),
        map: src.generateMap({
          source: id,
          includeContent: true,
          hires: true,
        }),
      };
    },
  } satisfies Plugin;
}

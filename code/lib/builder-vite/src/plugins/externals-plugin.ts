import { init, parse } from 'es-module-lexer';
import MagicString from 'magic-string';
import { globals } from '@storybook/preview/globals';

type SingleGlobalName = keyof typeof globals;

export async function externalsPlugin() {
  await init;
  return {
    name: 'storybook:externals-plugin',
    enforce: 'post',
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
  };
}

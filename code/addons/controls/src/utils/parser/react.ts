import { parse as parseCjs, init as initCjsParser } from 'cjs-module-lexer';
import { parse as parseEs } from 'es-module-lexer';

import type { Parser } from '../parser';

export class ReactParser implements Parser {
  async parse(source: string) {
    try {
      // Do NOT remove await here. The types are wrong! It has to be awaited,
      // otherwise it will return a Promise<Promise<...>> when wasm isn't loaded.
      const [, exports] = await parseEs(source);

      return {
        exports: (exports ?? []).map((e) => {
          const name = source.substring(e.s, e.e);
          return {
            name,
            default: name === 'default',
          };
        }),
      };
      // Try to parse as CJS module
    } catch {
      await initCjsParser();

      const exports = (parseCjs(source).exports ?? []).filter((e: string) => e !== '__esModule');

      return {
        exports: (exports ?? []).map((name) => ({
          name,
          default: name === 'default',
        })),
      };
    }
  }
}

import { parse as parseCjs, init as initCjsParser } from 'cjs-module-lexer';
import { parse as parseEs } from 'es-module-lexer';
import MagicString from 'magic-string';
import type { LoaderContext } from 'webpack';

export default async function loader(
  this: LoaderContext<any>,
  source: string,
  map: any,
  meta: any
) {
  const callback = this.async();

  try {
    let isEsModule = true, esImports, moduleExports, namedExportsOrder;
    
    try {
      // Do NOT remove await here. The types are wrong! It has to be awaited,
      // otherwise it will return a Promise<Promise<...>> when wasm isn't loaded.
      const parseResult = await parseEs(source);
      esImports = parseResult[0] || [];
      moduleExports = parseResult[1] || [];
    } catch {
      esImports = [];
      moduleExports = [];
    }
    
    if (!moduleExports.length && !esImports.length) {
      isEsModule = false;
      try {
        await initCjsParser();
        moduleExports = (parseCjs(source)).exports || [];
      } catch {
        moduleExports = [];
      }
      namedExportsOrder = moduleExports.filter(
        (e) => e !== 'default' && e !== '__esModule'
      );
    } else {
      namedExportsOrder = moduleExports.map(
        (e) => source.substring(e.s, e.e)
      ).filter((e) => e !== 'default');
    }

    if (namedExportsOrder.indexOf('__namedExportsOrder') >= 0) {
      return callback(null, source, map, meta);
    }

    const magicString = new MagicString(source);
    const namedExportsOrderString = JSON.stringify(namedExportsOrder);
    if (isEsModule) {
      magicString.append(
        `;export const __namedExportsOrder = ${namedExportsOrderString};`
      );
    } else {
      magicString.append(
        `;module.exports.__namedExportsOrder = ${namedExportsOrderString};`
      );
    }

    const generatedMap = magicString.generateMap({ hires: true });
    return callback(null, magicString.toString(), generatedMap, meta);
  } catch (err) {
    return callback(null, source, map, meta);
  }
}

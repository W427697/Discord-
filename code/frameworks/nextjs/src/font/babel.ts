/* eslint-disable import/no-duplicates */
import type * as BabelCoreNamespace from '@babel/core';
import {
  getVariableMetasBySpecifier,
  isDefined,
  removeTransformedVariableDeclarations,
  replaceImportWithParamterImport,
} from './babel.helpers';

type Babel = typeof BabelCoreNamespace;

/**
 * Transforms "@next/font" imports and usages to a webpack loader friendly format with parameters
 * @example
 * // Turns this code:
 * import { Inter, Roboto } from '@next/font/google'
 * import localFont from '@next/font/local'
 *
 * const myFont = localFont({ src: './my-font.woff2' })
 * const roboto = Roboto({
 *   weight: '400',
 * })
 *
 * const inter = Inter({
 *   subsets: ['latin'],
 * });
 *
 * // Into this code:
 * import inter from "@next/font/google?Inter;{\"subsets\":[\"latin\"]}";
 * import roboto from "@next/font/google?Roboto;{\"weight\":\"400\"}";
 * import myFont from "@next/font/local?localFont;{\"src\":\"./my-font.woff2\"}";
 *
 * This Plugin tries to adopt the functionality which is provided by the nextjs swc plugin
 * https://github.com/vercel/next.js/pull/40221
 */
export default function TransformFontImports({ types }: Babel): BabelCoreNamespace.PluginObj {
  return {
    name: 'storybook-nextjs-font-imports',
    visitor: {
      ImportDeclaration(path) {
        const { node } = path;
        const { source } = node;

        if (source.value === '@next/font/local') {
          const { specifiers } = node;

          // @next/font/local only provides a default export
          const specifier = specifiers[0];

          if (!path.parentPath.isProgram()) {
            return;
          }

          const program = path.parentPath;

          const variableMetas = getVariableMetasBySpecifier(program, types, specifier);

          removeTransformedVariableDeclarations(path, types, variableMetas);
          replaceImportWithParamterImport(path, types, source, variableMetas);
        }

        if (source.value === '@next/font/google') {
          const { specifiers } = node;

          const variableMetas = specifiers
            .flatMap((specifier) => {
              if (!path.parentPath.isProgram()) {
                return [];
              }

              const program = path.parentPath;

              return getVariableMetasBySpecifier(program, types, specifier);
            })
            .filter(isDefined);

          removeTransformedVariableDeclarations(path, types, variableMetas);
          replaceImportWithParamterImport(path, types, source, variableMetas);
        }
      },
    },
  };
}

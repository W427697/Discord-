import path from 'path';
import { createFilter } from '@rollup/pluginutils';
import {
  parse,
  builtinHandlers,
  builtinResolvers,
  builtinImporters,
  type Handler,
  type Documentation,
  type ResolverClass
} from 'react-docgen';
import MagicString from 'magic-string';
import type { PluginOption } from 'vite';
import actualNameHandler from './docgen-handlers/actualNameHandler';

type DocObj = Documentation & { actualName: string };

// Combine default handlers and custom handler
const handlers = [
  ...Object.values(builtinHandlers),
  actualNameHandler
] as Handler[];

const resolver = <ResolverClass><unknown>builtinResolvers.FindExportedDefinitionsResolver;
const importer = builtinImporters.fsImporter;

type Options = {
  include?: string | RegExp | (string | RegExp)[];
  exclude?: string | RegExp | (string | RegExp)[];
};

export function reactDocgen({
  include = /\.(mjs|tsx?|jsx?)$/,
  exclude = [/node_modules\/.*/],
}: Options = {}): PluginOption {
  const cwd = process.cwd();
  const filter = createFilter(include, exclude);

  return {
    name: 'storybook:react-docgen-plugin',
    enforce: 'pre',
    async transform(src: string, id: string) {
      const relPath = path.relative(cwd, id);
      if (!filter(relPath)) return;

      try {
        // Parse the source code with react-docgen
        const docgenResults = parse(src, {
          handlers,
          importer,
          resolver,
          filename: id,
        }) as DocObj[];
        const s = new MagicString(src);

        // Append docgenInfo to each component with an actualName
        docgenResults.forEach((info) => {
          const { actualName, ...docgenInfo } = info;
          if (actualName) {
            const docNode = JSON.stringify(docgenInfo);
            s.append(`;${actualName}.__docgenInfo=${docNode}`);
          }
        });

        // Return transformed code and source map
        return {
          code: s.toString(),
          map: s.generateMap(),
        };
      } catch (e) {
        // Uncomment the following line for troubleshooting errors from react-docgen
        // console.error(e);
      }
    },
  };
}

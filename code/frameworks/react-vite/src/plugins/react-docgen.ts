import path, { join } from 'path';
import { createFilter } from '@rollup/pluginutils';
import {
  parse,
  makeFsImporter,
  builtinHandlers as docgenHandlers,
  builtinResolvers as docgenResolver,
} from 'react-docgen';
import MagicString from 'magic-string';
import type { PluginOption } from 'vite';
import actualNameHandler from './docgen-handlers/actualNameHandler';

// TODO: None of these are able to be overridden, so `default` is aspirational here.
const defaultHandlers = Object.values(docgenHandlers).map((handler) => handler);
const defaultResolver = docgenResolver.findAllExportedComponentDefinitions;
const defaultImporter = makeFsImporter();
const handlers = [...defaultHandlers, actualNameHandler];

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
      const relPath = `.${path.sep}${path.relative(cwd, id)}`;

      if (!filter(relPath)) {
        return;
      }

      try {
        console.log('TRY', relPath);
        // Since we're using `findAllExportedComponentDefinitions`, this will always be an array.
        const docgenResults = parse(src, {
          handlers: [].concat(handlers),
          filename: id,
          importer: defaultImporter,
          resolver: defaultResolver,
        });
        const s = new MagicString(src);

        console.log({ docgenResults });

        docgenResults.forEach((info) => {
          const { actualName, ...docgenInfo } = info;
          if (actualName) {
            const docNode = JSON.stringify(docgenInfo);
            s.append(`;${actualName}.__docgenInfo=${docNode}`);
          }
        });

        // eslint-disable-next-line consistent-return
        return {
          code: s.toString(),
          map: s.generateMap(),
        };
      } catch (e) {
        // Usually this is just an error from react-docgen that it couldn't find a component
        // Only uncomment for troubleshooting
        console.error(e);
      }
    },
  };
}

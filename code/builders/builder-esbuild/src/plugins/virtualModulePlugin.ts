import type { Plugin } from 'esbuild';
import { dirname } from 'path';

const pluginName = 'virtual-module';

export function virtualModulePlugin(virtualModuleMapping: Record<string, string>): Plugin {
  return {
    name: pluginName,
    setup(build) {
      const filter = new RegExp(
        `${Object.keys(virtualModuleMapping)
          .map((name) => `^${name}$`)
          .join('|')}`
      );

      build.onResolve({ filter }, (args) => {
        return {
          path: args.path,
          namespace: pluginName,
        };
      });

      build.onLoad({ filter: /.*/, namespace: pluginName }, async (args) => {
        return {
          contents: virtualModuleMapping[args.path],
          loader: 'js',
          resolveDir: dirname(args.path),
        };
      });
    },
  };
}

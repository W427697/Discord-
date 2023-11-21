import { BuildOptions, Plugin } from 'esbuild';

export const getExtendBuildOptionPlugin = (options: BuildOptions): Plugin => ({
  name: 'extend-build-option-plugin',
  setup(build) {
    const { initialOptions } = build;
    initialOptions.entryPoints = options.entryPoints;
    initialOptions.outdir = options.outdir;
    initialOptions.chunkNames = options.chunkNames;
    initialOptions.entryNames = options.entryNames;
    initialOptions.bundle = true;
    initialOptions.minify = true;
    initialOptions.splitting = true;
    initialOptions.alias = {
      ...(initialOptions.alias ?? {}),
      ...options.alias,
    };
    initialOptions.define = {
      ...(initialOptions.define ?? {}),
      ...options.define,
    };
    initialOptions.sourceRoot = options.sourceRoot;
    initialOptions.preserveSymlinks = options.preserveSymlinks;
    initialOptions.resolveExtensions = Array.from(
      new Set([...initialOptions.resolveExtensions, ...options.resolveExtensions])
    );
    initialOptions.conditions = ['browser', 'module', 'default'];
    initialOptions.format = 'esm';
    initialOptions.metafile = true;
    initialOptions.plugins = [...(initialOptions.plugins ?? []), ...options.plugins];
  },
});

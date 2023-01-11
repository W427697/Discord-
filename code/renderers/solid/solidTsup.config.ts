import { build } from 'tsup';
import { solidPlugin } from 'esbuild-plugin-solid';

const external = [
  '@storybook/solid',
  '@storybook/core-client',
  '@storybook/docs-tools',
  '@storybook/global',
  '@storybook/preview-api',
  '@storybook/types',
  'ts-dedent',
  '@babel/core',
  'esbuild',
  'solid-js',
];

build({
  entry: ['src/config.ts', 'src/index.ts'],
  clean: true,
  outDir: 'dist',
  format: ['esm'],
  target: 'chrome100',
  platform: 'browser',
  esbuildPlugins: [solidPlugin()],
  external,

  esbuildOptions: (c) => {
    c.conditions = ['module'];
    c.platform = 'browser';
  },
});

build({
  entry: ['src/config.ts', 'src/index.ts'],
  clean: true,
  outDir: 'dist',
  format: ['cjs'],
  target: 'node16',
  platform: 'node',
  external,
  esbuildPlugins: [solidPlugin()],
  esbuildOptions: (c) => {
    c.platform = 'node';
  },
});

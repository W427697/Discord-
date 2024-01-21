import { type defineConfig as definer } from '../../../scripts/node_modules/tsup';
// import { readFile } from 'node:fs/promises';

// const pkg = await readFile('./package.json', 'utf-8').then((s) => JSON.parse(s));

const nodeBuildIn = [
  'assert',
  'buffer',
  'child_process',
  'cluster',
  'crypto',
  'dgram',
  'dns',
  'domain',
  'events',
  'fs',
  'http',
  'https',
  'net',
  'os',
  'path',
  'punycode',
  'querystring',
  'readline',
  'stream',
  'string_decoder',
  'tls',
  'tty',
  'url',
  'util',
  'v8',
  'vm',
  'zlib',
].flatMap((name) => [name, `node:${name}`]);

const defineConfig: typeof definer = (config) => config;

const common = [
  //
  './src/modules/channels/index.ts',
  './src/modules/components/index.ts',
  './src/modules/blocks/index.ts',
  './src/modules/instrumenter/index.ts',
  './src/modules/types/index.ts',

  './src/modules/events/index.ts',
  './src/modules/events/errors/preview-errors.ts',
  './src/modules/events/errors/manager-errors.ts',

  './src/modules/client-logger/index.ts',
  './src/modules/preview-api/index.ts',
  './src/modules/telemetry/index.ts',
  './src/modules/docs-tools/index.ts',
];

const browser = [
  //
  './src/modules/router/index.ts',
  './src/modules/theming/index.ts',
  './src/modules/theming/create.ts',
  './src/modules/router/utils.ts',
  './src/modules/manager/runtime.ts',
  './src/modules/manager/index.ts',
  './src/modules/manager-api/index.tsx',
];

const node = [
  //
  './src/modules/core-common/index.ts',
  './src/modules/events/errors/server-errors.ts',
  './src/modules/node-logger/index.ts',
  './src/modules/builder-manager/index.ts',
  './src/modules/csf-tools/index.ts',
  './src/modules/core-server/index.ts',
  './src/modules/core-server/presets/common-preset.ts',
  './src/modules/core-server/presets/common-manager.ts',
  './src/modules/core-server/presets/common-override-preset.ts',
  './src/modules/manager/globals.ts',
  './src/modules/manager/globals-module-info.ts',
];

// const newLocal = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies });
export default defineConfig([
  {
    entry: [...common, ...browser],
    format: ['esm'],
    splitting: true,
    target: ['chrome100', 'safari15', 'firefox91'],
  },
  {
    entry: [...common, ...node],
    format: ['cjs', 'esm'],
    splitting: true,
    target: ['node18'],
    external: nodeBuildIn,
  },
]);

// export default defineConfig([
//   {
//     entry: ['./src/modules/channels/index.ts'],
//     format: ['esm'],
//     target: ['chrome100', 'safari15', 'firefox91'],
//   },
//   {
//     entry: ['./src/modules/channels/index.ts'],
//     format: ['cjs'],
//     target: ['node18'],
//   },
//   {
//     entry: ['./src/modules/components/index.ts'],
//     format: ['esm'],
//     target: ['chrome100', 'safari15', 'firefox91'],
//   },
//   {
//     entry: ['./src/modules/components/index.ts'],
//     format: ['cjs'],
//     target: ['node18'],
//   },
//   {
//     entry: ['./src/modules/blocks/index.ts'],
//     format: ['esm'],
//     target: ['chrome100', 'safari15', 'firefox91'],
//   },
//   {
//     entry: ['./src/modules/blocks/index.ts'],
//     format: ['cjs'],
//     target: ['node18'],
//   },
//   {
//     entry: ['./src/modules/instrumenter/index.ts'],
//     format: ['esm'],
//     target: ['chrome100', 'safari15', 'firefox91'],
//   },
//   {
//     entry: ['./src/modules/instrumenter/index.ts'],
//     format: ['cjs'],
//     target: ['node18'],
//   },
//   {
//     entry: ['./src/modules/client-logger/index.ts'],
//     format: ['esm', 'cjs'],
//     target: ['chrome100', 'safari15', 'firefox91'],
//   },
//   {
//     entry: ['./src/modules/core-common/index.ts'],
//     format: ['esm', 'cjs'],
//     target: ['node18'],
//   },
//   {
//     entry: ['./src/modules/node-logger/index.ts'],
//     format: ['esm', 'cjs'],
//     target: ['node18'],
//   },
//   {
//     entry: ['./src/modules/types/index.ts'],
//     format: ['cjs'],
//     target: ['node18'],
//   },
//   {
//     entry: ['./src/modules/types/index.ts'],
//     format: ['esm'],
//     target: ['chrome100', 'safari15', 'firefox91'],
//   },
//   {
//     entry: ['./src/modules/events/index.ts'],
//     format: ['esm', 'cjs'],
//     target: ['chrome100', 'safari15', 'firefox91'],
//   },
//   {
//     entry: ['./src/modules/manager-api/index.tsx'],
//     format: ['esm', 'cjs'],
//     target: ['chrome100', 'safari15', 'firefox91'],
//   },
//   {
//     entry: ['./src/modules/router/index.ts'],
//     format: ['esm', 'cjs'],
//     target: ['chrome100', 'safari15', 'firefox91'],
//   },
//   {
//     entry: ['./src/modules/theming/index.ts', './src/modules/theming/create.ts'],
//     format: ['esm', 'cjs'],
//     target: ['chrome100', 'safari15', 'firefox91'],
//   },
//   {
//     entry: [
//       './src/modules/events/errors/preview-errors.ts',
//       './src/modules/events/errors/manager-errors.ts',
//     ],
//     format: ['esm', 'cjs'],
//     target: ['chrome100', 'safari15', 'firefox91'],
//   },
//   {
//     entry: ['./src/modules/events/errors/server-errors.ts'],
//     format: ['esm', 'cjs'],
//     target: ['node18'],
//   },
//   {
//     entry: ['./src/modules/builder-manager/index.ts'],
//     format: ['esm', 'cjs'],
//     target: ['node18'],
//   },
//   {
//     entry: ['./src/modules/csf-tools/index.ts'],
//     format: ['esm', 'cjs'],
//     target: ['node18'],
//   },
//   {
//     entry: [
//       './src/modules/core-server/index.ts',
//       './src/modules/core-server/presets/common-preset.ts',
//       './src/modules/core-server/presets/common-manager.ts',
//       './src/modules/core-server/presets/common-override-preset.ts',
//     ],
//     format: ['esm', 'cjs'],
//     target: ['node18'],
//   },
//   {
//     entry: ['./src/modules/preview-api/index.ts'],
//     format: ['esm', 'cjs'],
//     target: ['chrome100', 'safari15', 'firefox91'],
//   },
//   {
//     entry: ['./src/modules/manager/globals-module-info.ts'],
//     format: ['esm', 'cjs'],
//     target: ['node18'],
//   },
//   {
//     entry: [
//       './src/modules/manager/runtime.ts',
//       './src/modules/manager/index.ts',
//       './src/modules/manager/globals.ts',
//     ],
//     format: ['esm', 'cjs'],
//     target: ['chrome100', 'safari15', 'firefox91'],
//   },
// ]);

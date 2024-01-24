import { type defineConfig as definer } from '../../../scripts/node_modules/tsup';
// @ts-expect-error (whatever)
import aliasPlugin from '../../../scripts/node_modules/esbuild-plugin-alias';

// @ts-expect-error (whatever)
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
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
  './src/modules/blocks/index.ts',
  './src/modules/channels/index.ts',
  './src/modules/client-logger/index.ts',
  './src/modules/components/index.ts',
  './src/modules/docs-tools/index.ts',
  './src/modules/events/errors/manager-errors.ts',
  './src/modules/events/errors/preview-errors.ts',
  './src/modules/events/index.ts',
  './src/modules/instrumenter/index.ts',
  './src/modules/preview-api/index.ts',
  './src/modules/telemetry/index.ts',
  './src/modules/types/index.ts',
  './src/resolve/browser-assert.ts',
  './src/resolve/browser-process.ts',
  './src/resolve/browser-util.ts',
  './src/resolve/react-dom.ts',
  './src/resolve/react-runtime.ts',
  './src/resolve/react.ts',
];

const browser = [
  './src/modules/manager-api/index.tsx',
  './src/modules/manager/index.ts',
  './src/modules/router/index.ts',
  './src/modules/router/utils.ts',
  './src/modules/theming/create.ts',
  './src/modules/theming/index.ts',
];

const node = [
  './src/modules/builder-manager/index.ts',
  './src/modules/core-common/index.ts',
  './src/modules/core-server/index.ts',
  './src/modules/core-server/presets/common-override-preset.ts',
  './src/modules/core-server/presets/common-preset.ts',
  './src/modules/csf-tools/index.ts',
  './src/modules/events/errors/server-errors.ts',
  './src/modules/manager/globals-module-info.ts',
  './src/modules/manager/globals.ts',
  './src/modules/preview/globals.ts',
  './src/modules/node-logger/index.ts',
];

export default defineConfig([
  {
    entry: [...common, ...browser],
    format: ['esm'],
    splitting: true,
    target: ['chrome100', 'safari15', 'firefox91'],
    esbuildPlugins: [
      aliasPlugin({
        process: require.resolve('process/browser.js'),
        util: require.resolve('util/util.js'),
      }),
    ],
  },
  {
    entry: [...common, ...node],
    format: ['cjs', 'esm'],
    splitting: true,
    target: ['node18'],
    external: nodeBuildIn,
  },
]);

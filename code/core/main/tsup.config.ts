import { type defineConfig as definer } from '../../../scripts/node_modules/tsup';

const defineConfig: typeof definer = (config) => config;

const common = [
  './src/modules/channels/index.ts',
  './src/modules/client-logger/index.ts',
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
    format: 'esm',
    target: ['chrome100', 'safari15', 'firefox91'],
  },
  {
    entry: [...common, ...node],
    format: 'esm',
    target: ['node18'],
  },
  {
    entry: [...common, ...node],
    format: 'cjs',
    target: ['node18'],
  },
]);

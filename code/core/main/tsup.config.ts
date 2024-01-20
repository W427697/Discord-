import { type defineConfig as definer } from '../../../scripts/node_modules/tsup';

const defineConfig: typeof definer = (config) => config;

export default defineConfig([
  {
    entry: ['./src/modules/channels/index.ts'],
    format: ['esm'],
    target: ['chrome100', 'safari15', 'firefox91'],
  },
  {
    entry: ['./src/modules/channels/index.ts'],
    format: ['cjs'],
    target: ['node18'],
  },
  {
    entry: ['./src/modules/client-logger/index.ts'],
    format: ['esm', 'cjs'],
    target: ['chrome100', 'safari15', 'firefox91'],
  },
  {
    entry: ['./src/modules/core-common/index.ts'],
    format: ['esm', 'cjs'],
    target: ['node18'],
  },
  {
    entry: ['./src/modules/node-logger/index.ts'],
    format: ['esm', 'cjs'],
    target: ['node18'],
  },
  {
    entry: ['./src/modules/types/index.ts'],
    format: ['cjs'],
    target: ['node18'],
  },
  {
    entry: ['./src/modules/types/index.ts'],
    format: ['esm'],
    target: ['chrome100', 'safari15', 'firefox91'],
  },
  {
    entry: ['./src/modules/events/index.ts'],
    format: ['esm', 'cjs'],
    target: ['chrome100', 'safari15', 'firefox91'],
  },
  {
    entry: [
      './src/modules/events/errors/preview-errors.ts',
      './src/modules/events/errors/manager-errors.ts',
    ],
    format: ['esm', 'cjs'],
    target: ['chrome100', 'safari15', 'firefox91'],
  },
  {
    entry: ['./src/modules/events/errors/server-errors.ts'],
    format: ['esm', 'cjs'],
    target: ['node18'],
  },
]);

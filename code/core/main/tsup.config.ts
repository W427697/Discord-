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
    format: ['cjs'],
    target: ['node18'],
  },
  {
    entry: ['./src/modules/types/index.ts'],
    format: ['cjs'],
    target: ['node18'],
    // dts: true,
  },
  {
    entry: ['./src/modules/types/index.ts'],
    format: ['esm'],
    target: ['chrome100', 'safari15', 'firefox91'],
    // dts: true,
  },
  // {
  //   entry: ['./src/modules/channels/index.ts'],
  //   format: [],
  //   target: ['chrome100', 'safari15', 'firefox91'],
  //   dts: true,
  // },
]);

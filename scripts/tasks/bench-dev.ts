import { PORT } from './dev';
import { benchBuild } from './bench-build';

export const benchDev: typeof benchBuild = {
  ...benchBuild,
  description: 'Run benchmarks against a sandbox in dev mode',
  dependsOn: ['dev'],
  port: PORT,
};

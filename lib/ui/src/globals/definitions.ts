import type { ModuleInfo } from '@fal-works/esbuild-plugin-global-externals';
import x from './exports';
import { Keys, Definitions } from './types';

const createModuleInfo = (m: keyof typeof Keys): Required<ModuleInfo> => ({
  type: 'esm',
  varName: `__${Keys[m]}__`,
  namedExports: x[m],
  defaultExport: true,
});

export const definitions: Definitions = Object.keys(Keys).reduce<Definitions>(
  (acc, key: keyof typeof Keys) => {
    acc[key] = createModuleInfo(key);
    return acc;
  },
  {} as Definitions
);

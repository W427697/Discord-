import type { ModuleInfo } from '@fal-works/esbuild-plugin-global-externals';
import Exports from './generated/exports';
import { globalVars } from './globalVars';

type Definition = Record<keyof typeof Exports, Required<ModuleInfo>>;

/*
 * We create a map of a module's name to a ModuleInfo.
 * Which is a config object for a esbuild-plugin, to swap a import of a module to a reference of a global variable.
 * To get this plugin to do the best job it can, it needs to know all the exports in the ModuleInfo config object.
 * We generate this information via a script into `exports.ts`.
 *
 * It's really important that there are no actual to the runtime of the modules, hence the cumbersome generation.
 * But we also want to ensure we don't miss any exports, or globals.
 *
 * So in order to add additional modules to be swapped for globals, you need to add them to:
 * - a new file in `/global`
 * - `globalVars.ts`.
 *
 * If you forget to do either, TypeScript will complain.
 *
 * This `definitions.ts` file is consumed by the `builder-vite` and `builder-webpack5` packages,
 */

const createModuleInfo = (m: keyof typeof Exports): Required<ModuleInfo> => ({
  type: 'esm',
  varName: globalVars[m],
  namedExports: Exports[m],
  defaultExport: true,
});

function assertKey(key: string): asserts key is keyof typeof Exports {
  if (!Object.keys(Exports).includes(key)) throw new Error(`Key "${key}" not found in exports.ts`);
}

export const definitions = Object.keys(Exports).reduce<Definition>((acc, key: string) => {
  assertKey(key);
  acc[key] = createModuleInfo(key);
  return acc;
}, {} as Definition);

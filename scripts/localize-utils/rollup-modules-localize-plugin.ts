import type { Plugin } from 'rollup';
import { transformAsync } from '@babel/core';
import { dirname, join, relative } from 'path';
import { babelModulesLocalizePlugin } from './babel-modules-localize-plugin';
import { getPackageName } from './localize';

export const rollupModulesLocalisePlugin = (externals: string[]): Plugin => {
  function localize(_from: string, required: string, isResolve?: boolean): string {
    const packageName = getPackageName(required);

    if (externals.includes(packageName)) {
      return required;
    }

    if (!packageName) {
      return required;
    }

    if (isResolve) {
      return join('..', 'local_modules', required);
    }

    const relativePath = dirname(relative(_from, process.cwd()));

    const result = join(relativePath, `local_modules`, required);

    return result;
  }

  async function transform(code: string, id: string) {
    const out = await transformAsync(code, {
      plugins: [babelModulesLocalizePlugin(localize.bind(null, id))],
    });
    return {
      code: out.code,
      map: out.map,
    };
  }

  return {
    name: 'rollup-modules-localize-plugin',
    transform,
  };
};

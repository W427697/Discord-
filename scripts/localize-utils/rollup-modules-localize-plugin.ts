import type { Plugin, TransformPluginContext } from 'rollup';
import { transformAsync } from '@babel/core';
import { babelModulesLocalizePlugin } from './babel-modules-localize-plugin';
import { getPackageName } from './localize';

export const rollupModulesLocalisePlugin = (externals: string[]): Plugin => {
  function localize(this: TransformPluginContext, from: string, required: string) {
    const packageName = getPackageName(required);

    if (externals.includes(packageName)) {
      return required;
    }

    return `../local_modules/${required}`;
  }

  async function transform(this: TransformPluginContext, code: string, id: string) {
    const out = await transformAsync(code, {
      plugins: [babelModulesLocalizePlugin(localize.bind(this, id))],
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

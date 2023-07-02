import path from 'path';

import type { PluginOption } from 'vite';
import { createFilter } from 'vite';
import MagicString from 'magic-string';

import type { MetaCheckerOptions } from 'vue-component-meta';
import { TypeMeta, createComponentMetaChecker } from 'vue-component-meta';
// eslint-disable-next-line import/no-unresolved
import { getProjectRoot } from 'lib/core-common/src';

export function vueComponentMeta(): PluginOption {
  const include = /\.(vue|ts|js|jsx|tsx)$/;
  const filter = createFilter(include);

  const checkerOptions: MetaCheckerOptions = {
    forceUseTs: true,
    schema: { ignore: ['MyIgnoredNestedProps'] },
    printer: { newLine: 1 },
  };

  const checker = createComponentMetaChecker(
    path.join(getProjectRoot(), 'tsconfig.json'),
    checkerOptions
  );

  return {
    name: 'storybook:vue-component-meta-plugin',
    async transform(src: string, id: string) {
      if (!filter(id)) return undefined;

      let metaSource;
      try {
        const meta = checker.getComponentMeta(id);

        metaSource = {
          exportName: checker.getExportNames(id)[0],
          displayName: id
            .split(path.sep)
            .slice(-1)
            .join('')
            .replace(/\.(vue|ts|js|jsx|tsx)/, ''),
          ...meta,
          sourceFiles: id,
        };

        if (meta.type === TypeMeta.Unknown) {
          return undefined;
        }

        metaSource = JSON.stringify(metaSource);

        const s = new MagicString(src);
        if (!id.endsWith('.vue')) {
          s.replace('export default defineComponent', 'const _sfc_main = defineComponent');
          s.append(`\nexport default _sfc_main`);
        }

        s.append(`;_sfc_main.__docgenInfo = ${metaSource}`);

        return {
          code: s.toString(),
          map: s.generateMap({ hires: true, source: id }),
        };
      } catch (e) {
        return undefined;
      }
    },
  };
}

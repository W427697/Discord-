import * as url from 'url';
import path from 'path';
import { parse } from 'vue-docgen-api';
import type { PluginOption } from 'vite';
import { createFilter } from 'vite';
import MagicString from 'magic-string';

import type { MetaCheckerOptions } from 'vue-component-meta';
import { createComponentMetaChecker } from 'vue-component-meta';

export function vueDocgen(): PluginOption {
  const include = /\.(vue)$/;
  const filter = createFilter(include);

  const checkerOptions: MetaCheckerOptions = {
    forceUseTs: true,
    schema: { ignore: ['MyIgnoredNestedProps'] },
    printer: { newLine: 1 },
  };

  const checker = createComponentMetaChecker(
    path.join(__dirname, '../../../../tsconfig.json'),
    checkerOptions
  );

  return {
    name: 'storybook:vue-docgen-plugin',

    async transform(src: string, id: string) {
      if (!filter(id)) return undefined;

      // const metaData = await parse(id);
      // const metaSource = JSON.stringify(metaData);
      // const meta = checker.getComponentMeta(id);
      let metaSource;
      try {
        metaSource = {
          exportName: checker.getExportNames(id)[0],
          displayName: id.split(path.sep).slice(-1).join('').replace('.vue', ''),
          ...checker.getComponentMeta(id),
          sourceFiles: id,
        };
      } catch (e) {
        console.log(' checker error = ', e);
      }
      metaSource = JSON.stringify(metaSource);
      console.log('id = ', id);
      console.log('metaSource = ', metaSource);
      const s = new MagicString(src);
      s.append(`;_sfc_main.__docgenInfo = ${metaSource}`);

      return {
        code: s.toString(),
        map: s.generateMap({ hires: true, source: id }),
      };
    },
  };
}

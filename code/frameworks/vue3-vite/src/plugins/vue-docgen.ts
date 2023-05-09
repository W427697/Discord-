import path from 'path';

import type { PluginOption } from 'vite';
import { createFilter } from 'vite';
import MagicString from 'magic-string';

import type { MetaCheckerOptions } from 'vue-component-meta';
import { createComponentMetaChecker } from 'vue-component-meta';

export function vueDocgen(): PluginOption {
  const include = /\.(vue|ts)$/;
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

      let metaSource;
      try {
        const meta = checker.getComponentMeta(id);

        console.log('\n meta = props :', meta.props);
        metaSource = {
          exportName: checker.getExportNames(id)[0],
          displayName: id
            .split(path.sep)
            .slice(-1)
            .join('')
            .replace(/\.(vue|ts)/, ''),
          ...meta,
          sourceFiles: id,
        };
        if (
          !id.includes('.vue') &&
          meta.props.length === 0 &&
          meta.slots.length === 0 &&
          meta.events.length === 0
        )
          return undefined;
      } catch (e) {
        console.log('-------Checker error = ', e);
        return undefined;
      }
      console.log('\n\n metaSource :\n', metaSource);
      metaSource = JSON.stringify(metaSource);
      // console.log(' metaSource = ', metaSource);

      const s = new MagicString(src);
      s.append(`;_sfc_main.__docgenInfo = ${metaSource}`);

      console.log('\n\n--- s: \n', s.toString(), '\n');

      return {
        code: s.toString(),
        map: s.generateMap({ hires: true, source: id }),
      };
    },
  };
}

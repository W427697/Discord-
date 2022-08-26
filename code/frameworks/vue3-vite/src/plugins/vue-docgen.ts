import { parse } from 'vue-docgen-api';
import type { Plugin } from 'vite';
import { createFilter } from 'vite';
import MagicString from 'magic-string';

export function vueDocgen(): Plugin {
  const include = /\.(vue)$/;
  const filter = createFilter(include);

  return {
    name: 'vue-docgen',

    async transform(src: string, id: string) {
      if (!filter(id)) return undefined;

      const metaData = await parse(id);
      const metaSource = JSON.stringify(metaData);
      const s = new MagicString(src);
      s.append(`;_sfc_main.__docgenInfo = ${metaSource}`);

      return {
        code: s.toString(),
        map: s.generateMap({ hires: true, source: id }),
      };
    },
  };
}

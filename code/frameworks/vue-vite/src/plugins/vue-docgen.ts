import { parse } from 'vue-docgen-api';
import type { PluginOption } from 'vite';
import MagicString from 'magic-string';

export async function vueDocgen(): Promise<PluginOption> {
  const include = /\.(vue)$/;
  const { createFilter } = await import('vite');
  const filter = createFilter(include);

  return {
    name: 'storybook:vue2-docgen-plugin',

    async transform(src: string, id: string) {
      if (!filter(id)) return undefined;

      const metaData = await parse(id);
      const metaSource = JSON.stringify(metaData);
      const s = new MagicString(src);
      s.append(`;__component__.exports.__docgenInfo = ${metaSource}`);

      return {
        code: s.toString(),
        map: s.generateMap({ hires: true, source: id }),
      };
    },
  };
}

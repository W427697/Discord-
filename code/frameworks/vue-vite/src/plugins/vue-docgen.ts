import { parse } from 'vue-docgen-api';
import type { PluginOption, InlineConfig } from 'vite';
import { createFilter } from 'vite';
import MagicString from 'magic-string';
import { resolveAlias } from '@storybook/builder-vite';

export function vueDocgen(config: InlineConfig): PluginOption {
  const include = /\.(vue)$/;
  const filter = createFilter(include);

  return {
    name: 'storybook:vue2-docgen-plugin',

    async transform(src: string, id: string) {
      if (!filter(id)) return undefined;

      const alias = resolveAlias(config);
      const metaData = await parse(id, {
        alias,
      });
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

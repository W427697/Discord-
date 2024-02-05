import * as svelte from 'svelte/compiler';

import MagicString from 'magic-string';
import { extractStories } from '../parser/extract-stories';
import { fileURLToPath } from 'url';
import { getNameFromFilename } from '../parser/svelte-stories-loader';
import { readFileSync } from 'fs';

const parser = fileURLToPath(new URL('../parser/collect-stories', import.meta.url)).replace(
  /\\/g,
  '\\\\'
); // For Windows paths

export const csfPlugin = async (svelteOptions) => {
  // eslint-disable-next-line import/no-extraneous-dependencies
  const vite = await import('vite');
  const include = /\.stories\.svelte$/;
  const filter = vite.createFilter(include);

  return {
    name: 'storybook:addon-svelte-csf-plugin',
    enforce: 'post',
    async transform(code, id) {
      if (!filter(id)) return undefined;

      const s = new MagicString(code);
      const component = getNameFromFilename(id);
      let source = readFileSync(id).toString();
      if (svelteOptions && svelteOptions.preprocess) {
        source = (await svelte.preprocess(source, svelteOptions.preprocess, { filename: id })).code;
      }
      const all = extractStories(source);
      const { stories } = all;
      const storyDef = Object.entries(stories)
        .filter(([, def]) => !def.template)
        .map(
          ([storyId]) =>
            `export const ${storyId} = __storiesMetaData.stories[${JSON.stringify(storyId)}];`
        )
        .join('\n');

      s.replace('export default', '// export default');

      const namedExportsOrder = Object.entries(stories)
        .filter(([, def]) => !def.template)
        .map(([storyId]) => storyId);

      const metaExported = code.includes('export { meta }');
      s.replace('export { meta };', '// export { meta };');
      const output = [
        '',
        `import parser from '${parser}';`,
        `const __storiesMetaData = parser(${component}, ${JSON.stringify(all)}${
          metaExported ? ', meta' : ''
        });`,
        'export default __storiesMetaData.meta;',
        `export const __namedExportsOrder = ${JSON.stringify(namedExportsOrder)};`,
        storyDef,
      ].join('\n');

      s.append(output);

      return {
        code: s.toString(),
        map: s.generateMap({ hires: true, source: id }),
      };
    },
  };
};

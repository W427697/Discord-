import type { Plugin } from 'vite';
import { createFilter } from 'vite';

/**
 * Storybook uses two different loaders when dealing with MDX:
 *
 * - *stories.mdx and *story.mdx are compiled with the CSF compiler
 * - *.mdx are compiled with the MDX compiler directly
 *
 * @see https://github.com/storybookjs/storybook/blob/next/addons/docs/docs/recipes.md#csf-stories-with-arbitrary-mdx
 */
const isStorybookMdx = (id: string) => id.endsWith('stories.mdx') || id.endsWith('story.mdx');

export function mdxPlugin(): Plugin {
  const include = /\.mdx?$/;
  const filter = createFilter(include);

  return {
    name: 'storybook:mdx-plugin',
    enforce: 'pre',
    async transform(src, id, options) {
      if (!filter(id)) return undefined;

      // @ts-expect-error typescript doesn't think compile exists, but it does.
      const { compile } = await import('@storybook/mdx2-csf');

      const mdxCode = String(await compile(src, { skipCsf: !isStorybookMdx(id) }));
      return mdxCode;
    },
  };
}

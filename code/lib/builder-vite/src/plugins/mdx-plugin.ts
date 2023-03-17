import type { Options } from '@storybook/types';
import type { Plugin } from 'vite';
import { createFilter } from 'vite';
import type { Root } from 'remark-mdx';
import { visit } from 'unist-util-visit';

const isStorybookMdx = (id: string) => id.endsWith('stories.mdx') || id.endsWith('story.mdx');

const rehypeFencedCode = function () {
  return (tree: Root) => {
    visit(tree, 'element', (node: any) => {
      const metastring = node.data?.meta;
      if (node.tagName === 'code' && metastring) {
        // eslint-disable-next-line no-param-reassign
        node.properties = {
          ...node.properties,
          metastring,
          dark: metastring.includes('dark'),
        };
      }
    });
  };
};

/**
 * Storybook uses two different loaders when dealing with MDX:
 *
 * - *stories.mdx and *story.mdx are compiled with the CSF compiler
 * - *.mdx are compiled with the MDX compiler directly
 *
 * @see https://github.com/storybookjs/storybook/blob/next/addons/docs/docs/recipes.md#csf-stories-with-arbitrary-mdx
 */
export async function mdxPlugin(options: Options): Promise<Plugin> {
  const include = /\.mdx$/;
  const filter = createFilter(include);
  const { features, presets } = options;
  const { mdxPluginOptions, jsxOptions } = await presets.apply<Record<string, any>>('options', {});

  return {
    name: 'storybook:mdx-plugin',
    enforce: 'pre',
    async transform(src, id) {
      if (!filter(id)) return undefined;

      const { compile } = features?.legacyMdx1
        ? await import('@storybook/mdx1-csf')
        : await import('@storybook/mdx2-csf');

      const mdxLoaderOptions = await options.presets.apply('mdxLoaderOptions', {
        ...mdxPluginOptions,
        mdxCompileOptions: {
          providerImportSource: '@storybook/addon-docs/mdx-react-shim',
          ...mdxPluginOptions?.mdxCompileOptions,
          rehypePlugins: [
            rehypeFencedCode,
            ...(mdxPluginOptions?.mdxCompileOptions?.rehypePlugins ?? []),
          ],
        },
        jsxOptions,
      });

      const code = String(
        await compile(src, {
          skipCsf: !isStorybookMdx(id),
          ...mdxLoaderOptions,
        })
      );

      return {
        code,
        map: null, // TODO: update mdx2-csf to return the map
      };
    },
  };
}

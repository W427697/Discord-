import { dirname } from 'node:path';
import type { Options } from '@storybook/types';
import type { Plugin } from 'vite';
import { createFilter } from 'vite';

const isStorybookMdx = (id: string) => id.endsWith('stories.mdx') || id.endsWith('story.mdx');

// Grab the mdx compiler from the @mdx-js/react that comes with @storybook/mdx1-csf,
// and add it to the top of the code.
// Equivilent to https://github.com/storybookjs/mdx1-csf/blob/d58cb032a8902b3f24ad487b6a7aae11ba8b33f6/loader.js#L12-L16
function injectRenderer(code: string) {
  const mdxReactPackage = dirname(
    require.resolve('@mdx-js/react/package.json', {
      paths: [dirname(require.resolve('@storybook/mdx1-csf/package.json'))],
    })
  );

  return `
    import { mdx } from '${mdxReactPackage}';
    ${code}
    `;
}

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
        },
        jsxOptions,
      });

      const mdxCode = String(
        await compile(src, {
          skipCsf: !isStorybookMdx(id),
          ...mdxLoaderOptions,
        })
      );

      const code = features?.legacyMdx1 ? injectRenderer(mdxCode) : mdxCode;

      return {
        code,
        map: null, // TODO: update mdx2-csf to return the map
      };
    },
  };
}

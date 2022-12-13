import type { Options } from '@storybook/types';
import type { Plugin } from 'vite';
import { createFilter } from 'vite';
import reactVite from '@vitejs/plugin-react';

const isStorybookMdx = (id: string) => id.endsWith('stories.mdx') || id.endsWith('story.mdx');

function injectRenderer(code: string) {
  return `
           import React from 'react';
           ${code}
           `;
}

// HACK: find a better way to do this, ideally avoiding @vitejs/plugin-react entirely.
// We're just using it to run the mdx with jsx through babel
// @ts-expect-error we know these have names, and what the shape will be
const viteBabel: Plugin | undefined = reactVite().find((p) => p.name === 'vite:react-babel');

/**
 * Storybook uses two different loaders when dealing with MDX:
 *
 * - *stories.mdx and *story.mdx are compiled with the CSF compiler
 * - *.mdx are compiled with the MDX compiler directly
 *
 * @see https://github.com/storybookjs/storybook/blob/next/addons/docs/docs/recipes.md#csf-stories-with-arbitrary-mdx
 */
export function mdxPlugin(options: Options): Plugin {
  const include = /\.mdx?$/;
  const filter = createFilter(include);

  return {
    name: 'storybook:mdx-plugin',
    enforce: 'pre',
    async transform(src, id, transformOptions) {
      if (!filter(id)) return undefined;

      const { compile } = await import('@storybook/mdx2-csf');

      const mdxLoaderOptions = await options.presets.apply('mdxLoaderOptions', {
        mdxCompileOptions: {
          providerImportSource: '@storybook/addon-docs/mdx-react-shim',
        },
      });

      const mdxCode = String(
        await compile(src, {
          skipCsf: !isStorybookMdx(id),
          ...mdxLoaderOptions,
        })
      );

      const modifiedCode = injectRenderer(mdxCode);

      // Hooks in recent rollup versions can be functions or objects, and though react hasn't changed, the typescript defs have
      const rTransform = viteBabel?.transform;
      const transform = rTransform && 'handler' in rTransform ? rTransform.handler : rTransform;

      // It's safe to disable this, because we know it'll be there, since we added it ourselves.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const result = await transform!.call(this, modifiedCode, `${id}.jsx`, transformOptions);

      if (!result) return modifiedCode;

      if (typeof result === 'string') return result;

      const { code, map: resultMap } = result;

      return {
        code,
        map:
          !resultMap || typeof resultMap === 'string' ? resultMap : { ...resultMap, sources: [id] },
      };
    },
  };
}

import { readFile, writeFile } from 'fs/promises';
import { ensureDir } from 'fs-extra';
import { dirname, join, relative } from 'path';
import { dedent } from 'ts-dedent';

import type { PresetProperty, Indexer } from '@storybook/types';
import { loadCsf } from '@storybook/csf-tools';
import type { StorybookConfig } from './types';

const wrapForPnP = (input: string) => dirname(require.resolve(join(input, 'package.json')));

// export const addons: PresetProperty<'addons', StorybookConfig> = [
//   wrapForPnP('@storybook/preset-server-webpack'),
// ];

// FIXME: preview.js is not being loaded for frameworks?
export const previewAnnotations = (entry = []) => {
  return [...entry, require.resolve('../dist/preview.mjs')];
};

const rewritingIndexer: Indexer = {
  test: /(stories|story)\.[tj]sx?$/,
  createIndex: async (fileName, opts) => {
    console.log('indexing', fileName);
    const code = (await readFile(fileName, 'utf-8')).toString();
    const csf = await loadCsf(code, { ...opts, fileName }).parse();

    const storiesDir = join(process.cwd(), 'app', 'nextjs-stories');
    await Promise.all(
      csf.stories.map(async (story) => {
        const storyDir = join(storiesDir, story.id);
        await ensureDir(storyDir);
        const pageFile = join(storyDir, 'page.jsx');
        const relativePath = relative(dirname(pageFile), fileName);
        const { exportName } = story;
        console.log({ story });

        const pageJsx = dedent`
          import { indexStory } from '@storybook/nextjs-server/server';

          const page = async ({ searchParams }) => {
            const stories = await import('${relativePath}');
            const Component = indexStory('${exportName}', stories);
            return <Component {...searchParams } />;
          }
          export default page;
        `;
        await writeFile(pageFile, pageJsx);
      })
    );

    return csf.indexInputs;
  },
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const experimental_indexers = async (existingIndexers?: Indexer[]) => {
  console.log('experimental_indexers');
  return [rewritingIndexer, ...(existingIndexers || [])];
};

export const core: PresetProperty<'core', StorybookConfig> = async (config, options) => {
  const framework = await options.presets.apply<StorybookConfig['framework']>('framework');

  return {
    ...config,
    builder: {
      name: wrapForPnP('@storybook/builder-vite') as '@storybook/builder-vite',
      options: typeof framework === 'string' ? {} : framework.options.builder || {},
    },
    renderer: wrapForPnP('@storybook/server'),
  };
};

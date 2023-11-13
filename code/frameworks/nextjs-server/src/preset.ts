import { cp, readFile, writeFile } from 'fs/promises';
import { ensureDir, exists } from 'fs-extra';
import { join, relative, resolve } from 'path';
import { dedent } from 'ts-dedent';

import type { PresetProperty, Indexer } from '@storybook/types';
import { loadCsf } from '@storybook/csf-tools';
import type { StorybookConfig } from './types';

const LAYOUT_FILES = ['layout.tsx', 'layout.jsx'];

const rewritingIndexer: Indexer = {
  test: /(stories|story)\.[tj]sx?$/,
  createIndex: async (fileName, opts) => {
    console.log('indexing', fileName);
    const code = (await readFile(fileName, 'utf-8')).toString();
    const csf = await loadCsf(code, { ...opts, fileName }).parse();

    const appDir = join(process.cwd(), 'app');
    const inputStorybookDir = resolve(__dirname, '../template/storybookPreview');
    const storybookDir = join(appDir, '(sb)', 'storybookPreview');
    const storybookPreview = join(process.cwd(), '.storybook', 'preview');

    try {
      await cp(inputStorybookDir, storybookDir, { recursive: true });
      const hasRootLayout = await Promise.any(
        LAYOUT_FILES.map((file) => exists(join(appDir, file)))
      );
      const inputLayout = hasRootLayout ? 'layout-nested.tsx' : 'layout-root.tsx';
      await cp(`${inputStorybookDir}/${inputLayout}`, `${storybookPreview}/layout.tsx`);
    } catch (err) {
      // FIXME: assume we've copied already
    }

    await Promise.all(
      csf.stories.map(async (story) => {
        const storyDir = join(storybookDir, story.id);
        await ensureDir(storyDir);
        const pageFile = join(storyDir, 'page.tsx');
        const relativeStoryPath = relative(storyDir, fileName).replace(/\.tsx?$/, '');
        const relativePreviewPath = relative(storyDir, storybookPreview);
        const { exportName } = story;
        console.log({ story });

        const pageTsx = dedent`
          import React from 'react';
          import { composeStory } from '@storybook/react/testing-api';
          import { getArgs } from '../components/args';
          import { Prepare, StoryAnnotations } from '../components/Prepare';
          import { Args } from '@storybook/react';

          const page = async () => {
            const stories = await import('${relativeStoryPath}');
            const projectAnnotations = await import('${relativePreviewPath}') as any;
            const Composed = composeStory(stories.${exportName}, stories.default, projectAnnotations?.default || {}, '${exportName}');
            const extraArgs = await getArgs(Composed.id);

            const { id, parameters, argTypes, initialArgs } = Composed;
            const args = { ...initialArgs, ...extraArgs };

            const storyAnnotations: StoryAnnotations<Args> = {
              id,
              parameters,
              argTypes,
              initialArgs,
              args,
            };
            return (
              <>
                <Prepare story={storyAnnotations} />
                {/* @ts-ignore TODO -- why? */}
                <Composed {...extraArgs} />
              </>
            );
          };
          export default page;
        `;
        await writeFile(pageFile, pageTsx);
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

export const core: PresetProperty<'core', StorybookConfig> = async (config) => {
  return {
    ...config,
    builder: {
      name: require.resolve('./null-builder') as '@storybook/builder-vite',
      options: {},
    },
    renderer: require.resolve('./null-renderer'),
  };
};

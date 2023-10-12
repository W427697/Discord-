import { cp, readFile, writeFile } from 'fs/promises';
import { ensureDir } from 'fs-extra';
import { dirname, join, relative, resolve } from 'path';
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

    const inputStorybookDir = resolve(__dirname, '../template/storybook');
    const storybookDir = join(process.cwd(), 'app', 'storybook');
    try {
      await cp(inputStorybookDir, storybookDir, { recursive: true });
    } catch (err) {
      // FIXME: assume we've copied already
    }

    await Promise.all(
      csf.stories.map(async (story) => {
        const storyDir = join(storybookDir, story.id);
        await ensureDir(storyDir);
        const pageFile = join(storyDir, 'page.tsx');
        const relativePath = relative(dirname(pageFile), fileName);
        const { exportName } = story;
        console.log({ story });

        const pageTsx = dedent`
          import React from 'react';
          import { composeStory } from '@storybook/react/testing-api';
          import { getArgs } from '../components/args';
          import { Prepare } from '../components/Prepare';
          import { StoryAnnotations } from '../components/Storybook';
          import { Args } from '@storybook/types';
          import projectAnnotations from '@/.storybook/preview';

          const page = async () => {
            const stories = await import('${relativePath}');
            const Composed = composeStory(stories.${exportName}, stories.default, projectAnnotations || {}, '${exportName}');
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

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
    // TODO
    const appDir = false;

    console.log('indexing', fileName);
    const code = (await readFile(fileName, 'utf-8')).toString();
    const csf = await loadCsf(code, { ...opts, fileName }).parse();

    const routeDir = appDir ? 'app' : 'pages';
    const inputStorybookDir = resolve(__dirname, `../template/${routeDir}/storybookPreview`);
    const storybookDir = join(process.cwd(), routeDir, 'storybookPreview');
    const storybookPreview = join(process.cwd(), '.storybook', 'preview');

    try {
      await cp(inputStorybookDir, storybookDir, { recursive: true });
    } catch (err) {
      // FIXME: assume we've copied already
    }

    await Promise.all(
      csf.stories.map(async (story) => {
        const storyDir = join(storybookDir, story.id);
        await ensureDir(storyDir);
        const relativeStoryPath = relative(storyDir, fileName).replace(/\.tsx?$/, '');
        const relativePreviewPath = relative(storyDir, storybookPreview);
        const { exportName } = story;
        console.log({ story });

        if (appDir) {
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

          const pageFile = join(storyDir, 'page.tsx');
          await writeFile(pageFile, pageTsx);
        } else {
          const indexTsx = dedent`
            import React, { useRef } from 'react';
            import { composeStory } from '@storybook/react/testing-api';
            import { useArgs } from '../components/args';
            import { Storybook } from '../components/Storybook';
            import { Prepare, StoryAnnotations } from '../components/Prepare';
            import { Args } from '@storybook/react';
            
            import * as stories from '${relativeStoryPath}';
            import * as projectAnnotations from '${relativePreviewPath}';

            const page = () => {
              const Composed = composeStory(stories.${exportName}, stories.default, projectAnnotations?.default || {}, '${exportName}');
              const extraArgs = useArgs(Composed.id);
              
              const { id, parameters, argTypes, initialArgs, play } = Composed;
              const args = { ...initialArgs, ...extraArgs };
              
              const storyAnnotations: StoryAnnotations<Args> = {
                id,
                parameters,
                argTypes,
                initialArgs,
                args,
                play
              };

              const storybookRootRef = useRef();

              return (
                <Storybook ref={storybookRootRef}>
                  <Prepare story={storyAnnotations} canvasElement={storybookRootRef.current} />
                  {/* @ts-ignore TODO -- why? */}
                  <Composed {...extraArgs} />
                </Storybook>
                );
              };
              export default page;
            `;

          const indexFile = join(storyDir, 'index.tsx');
          await writeFile(indexFile, indexTsx);
        }
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
      options: typeof framework === 'string' ? {} : framework?.options?.builder || {},
    },
    renderer: wrapForPnP('@storybook/server'),
  };
};

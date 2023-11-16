import { cp, readFile, writeFile } from 'fs/promises';
import { ensureDir, exists } from 'fs-extra';
import { dirname, join, relative, resolve } from 'path';
import { dedent } from 'ts-dedent';

import type { PresetProperty, Indexer, PreviewAnnotation } from '@storybook/types';
import { loadCsf } from '@storybook/csf-tools';
import type { StorybookConfig } from './types';

const wrapForPnP = (input: string) => dirname(require.resolve(join(input, 'package.json')));

// TODO
const appDir = false;

// export const addons: PresetProperty<'addons', StorybookConfig> = [
//   wrapForPnP('@storybook/preset-server-webpack'),
// ];

const LAYOUT_FILES = ['layout.tsx', 'layout.jsx'];

const rewritingIndexer = (allPreviewAnnotations: PreviewAnnotation[]): Indexer => {
  const workingDir = process.cwd(); // TODO we should probably put this on the preset options

  return {
    test: /(stories|story)\.[tj]sx?$/,
    createIndex: async (fileName, opts) => {
      console.log('indexing', fileName);
      const code = (await readFile(fileName, 'utf-8')).toString();
      const csf = await loadCsf(code, { ...opts, fileName }).parse();

      const routeDir = appDir ? 'app' : 'pages';
      const inputStorybookDir = resolve(__dirname, `../template/${routeDir}/storybookPreview`);
      const storybookDir = join(process.cwd(), routeDir, 'storybookPreview');
      await ensureDir(storybookDir);

      if (appDir) {
        try {
          await cp(inputStorybookDir, storybookDir, { recursive: true });
          const hasRootLayout = await Promise.any(
            LAYOUT_FILES.map((file) => exists(join(process.cwd(), routeDir, file)))
          );
          const inputLayout = hasRootLayout ? 'layout-nested.tsx' : 'layout-root.tsx';
          await cp(`${inputStorybookDir}/${inputLayout}`, join(storybookDir, 'layout.tsx'));
        } catch (err) {
          // FIXME: assume we've copied already
        }
      } else {
        const indexTsx = dedent`
          import React from 'react';
          import { Storybook } from './components/Storybook';
          
          const page = () => <Storybook />;
          export default page;
        `;
        const indexFile = join(storybookDir, 'index.tsx');
        await writeFile(indexFile, indexTsx);

        const projectAnnotationImports = allPreviewAnnotations
          .map((path, index) => `const projectAnnotations${index} = await import('${path}');`)
          .join('\n');

        const projectAnnotationArray = allPreviewAnnotations
          .map((_, index) => `projectAnnotations${index}`)
          .join(',');

        const storybookTsx = dedent`
          import React, { useEffect } from 'react';
          import { composeConfigs } from '@storybook/preview-api';
          import { Preview } from '@storybook/nextjs-server/pages';

          const getProjectAnnotations = async () => {
            ${projectAnnotationImports}
            return composeConfigs([${projectAnnotationArray}]);
          }

          export const Storybook = () => <Preview getProjectAnnotations={getProjectAnnotations} />;
        `;

        const componentsDir = join(storybookDir, 'components');
        await ensureDir(componentsDir);
        const storybookFile = join(componentsDir, 'Storybook.tsx');
        await writeFile(storybookFile, storybookTsx);
      }

      if (appDir) {
        await Promise.all(
          csf.stories.map(async (story) => {
            const storyDir = join(storybookDir, story.id);
            await ensureDir(storyDir);
            const relativeStoryPath = relative(storyDir, fileName).replace(/\.tsx?$/, '');
            const { exportName } = story;

            const pageTsx = dedent`
              import React from 'react';
              import { composeStory } from '@storybook/react/testing-api';
              import { getArgs } from '../components/args';
              import { Prepare, StoryAnnotations } from '../components/Prepare';
              import { Args } from '@storybook/react';
              
              const page = async () => {
                const stories = await import('${relativeStoryPath}');
                const projectAnnotations = {};
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
          })
        );
      } else {
        const componentId = csf.stories[0].id.split('--')[0];
        const relativeStoryPath = relative(storybookDir, fileName).replace(/\.tsx?$/, '');
        const importPath = relative(workingDir, fileName).replace(/^([^./])/, './$1');

        const csfImportTsx = dedent`
          import React from 'react';
          import { Storybook } from './components/Storybook';
          import * as stories from '${relativeStoryPath}';
          
          if (typeof window !== 'undefined') {
            window._storybook_onImport('${importPath}', stories);
          }
          

          const page = () => <Storybook />;
          export default page;
        `;

        const csfImportFile = join(storybookDir, `${componentId}.tsx`);
        await writeFile(csfImportFile, csfImportTsx);
      }

      return csf.indexInputs;
    },
  };
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const experimental_indexers: StorybookConfig['experimental_indexers'] = async (
  existingIndexers,
  { presets }
) => {
  console.log('experimental_indexers');

  const allPreviewAnnotations = [
    ...(await presets.apply<PreviewAnnotation[]>('previewAnnotations', [])).map((entry) => {
      if (typeof entry === 'object') {
        return entry.absolute;
      }
      return entry;
    }),
    join(process.cwd(), '.storybook', 'preview'), // FIXME is :point_down: better?
    // loadPreviewOrConfigFile(options),
  ].filter(Boolean);

  return [rewritingIndexer(allPreviewAnnotations), ...(existingIndexers || [])];
};

export const core: PresetProperty<'core', StorybookConfig> = async (config) => {
  return {
    ...config,
    builder: {
      name: require.resolve('./null-builder') as '@storybook/builder-vite',
      options: {},
    },
    renderer: appDir ? require.resolve('./null-renderer') : wrapForPnP('@storybook/react'),
  };
};

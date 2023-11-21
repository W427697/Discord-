import { dirname, join } from 'path';

import type { PresetProperty, PreviewAnnotation } from '@storybook/types';
import type { StorybookConfig, StorybookNextJSOptions } from './types';
import { appIndexer, pagesIndexer } from './indexers';

const wrapForPnP = (input: string) => dirname(require.resolve(join(input, 'package.json')));

const { appDir }: StorybookNextJSOptions = process.env.STORYBOOK_NEXTJS_OPTIONS
  ? JSON.parse(process.env.STORYBOOK_NEXTJS_OPTIONS)
  : {};

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

  const rewritingIndexer = appDir
    ? appIndexer(allPreviewAnnotations)
    : pagesIndexer(allPreviewAnnotations);
  return [rewritingIndexer, ...(existingIndexers || [])];
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

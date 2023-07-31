import fs from 'fs-extra';
import yaml from 'yaml';
import { toId } from '@storybook/csf';
import type { StaticMeta } from '@storybook/csf-tools';
import type {
  IndexedStory,
  StoryIndexer,
  StorybookConfig,
  Tag,
  StoryName,
  ComponentTitle,
} from '@storybook/types';

// export const storyIndexers: StorybookConfig['storyIndexers'] = (existingIndexers) => {
//   const serverIndexer: StoryIndexer['indexer'] = async (fileName) => {
//     const json = fileName.endsWith('.json')
//       ? await fs.readJson(fileName, 'utf-8')
//       : yaml.parse((await fs.readFile(fileName, 'utf-8')).toString());
//     const meta: StaticMeta = {
//       title: json.title,
//     };
//     const stories: IndexedStory[] = json.stories.map((story: { name: string }) => {
//       const id = toId(meta.title, story.name);
//       const { name } = story;
//       const indexedStory: IndexedStory = {
//         id,
//         name,
//       };
//       return indexedStory;
//     });
//     return {
//       meta,
//       stories,
//     };
//   };
//   return [
//     {
//       test: /(stories|story)\.(json|ya?ml)$/,
//       indexer: serverIndexer,
//     },
//     ...(existingIndexers || []),
//   ];
// };

type FileContent = {
  title: ComponentTitle;
  stories: { name: StoryName; tags?: Tag[] }[];
};

export const indexers: StorybookConfig['indexers'] = (existingIndexers) => [
  {
    test: /(stories|story)\.(json|ya?ml)$/,
    index: async (fileName) => {
      const content: FileContent = fileName.endsWith('.json')
        ? await fs.readJson(fileName, 'utf-8')
        : yaml.parse((await fs.readFile(fileName, 'utf-8')).toString());

      return content.stories.map((story) => ({
        importPath: fileName,
        exportName: story.name,
        name: story.name,
        title: content.title,
        tags: story.tags ?? [],
        type: 'story',
      }));
    },
  },
  ...(existingIndexers || []),
];

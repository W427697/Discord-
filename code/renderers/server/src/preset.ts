import fs from 'fs-extra';
import yaml from 'yaml';
import type { StorybookConfig, Tag, StoryName, ComponentTitle } from '@storybook/types';

type FileContent = {
  title: ComponentTitle;
  tags?: Tag[];
  stories: { name: StoryName; tags?: Tag[] }[];
};

export const indexers: StorybookConfig['indexers'] = (existingIndexers) => [
  {
    test: /(stories|story)\.(json|ya?ml)$/,
    index: async (fileName) => {
      const content: FileContent = fileName.endsWith('.json')
        ? await fs.readJson(fileName, 'utf-8')
        : yaml.parse((await fs.readFile(fileName, 'utf-8')).toString());

      return content.stories.map((story) => {
        const tags = Array.from(new Set([...(content.tags ?? []), ...(story.tags ?? [])]));
        return {
          importPath: fileName,
          exportName: story.name,
          name: story.name,
          title: content.title,
          tags,
          type: 'story',
        };
      });
    },
  },
  ...(existingIndexers || []),
];

import type { PreparedStory } from '@storybook/types';

export const parameters: any = {
  docs: {
    renderer: async () => {
      const { DocsRenderer } = (await import('./DocsRenderer')) as any;
      return new DocsRenderer();
    },
    autodocsFilter: (story: PreparedStory) => !story.parameters?.docs?.disable,
  },
};

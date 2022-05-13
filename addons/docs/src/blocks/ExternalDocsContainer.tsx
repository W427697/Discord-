import React from 'react';

import { ThemeProvider, themes, ensure } from '@storybook/theming';
import { DocsContextProps } from '@storybook/preview-web';
import { ModuleExport, Story } from '@storybook/store';
import { AnyFramework, StoryId } from '@storybook/csf';

import { DocsContext } from './DocsContext';
import { ExternalPreview } from './ExternalPreview';
import { SourceContainer } from './SourceContainer';

let preview: ExternalPreview<AnyFramework>;

export const ExternalDocsContainer: React.FC<{ projectAnnotations: any }> = ({
  projectAnnotations,
  children,
}) => {
  if (!preview) preview = new ExternalPreview(projectAnnotations);

  let pageMeta: ModuleExport;
  const setMeta = (m: ModuleExport) => {
    pageMeta = m;
  };

  const docsContext: DocsContextProps = {
    type: 'external',

    id: 'external-docs',
    title: 'External',
    name: 'Docs',

    storyIdByModuleExport: (storyExport: ModuleExport) => {
      return preview.storyIdByModuleExport(storyExport, pageMeta);
    },

    storyById: (id: StoryId) => {
      return preview.storyById(id);
    },

    getStoryContext: (story) => {
      return {
        ...preview.storyStore.getStoryContext(story),
        viewMode: 'docs',
      } as any;
    },

    componentStories: () => {
      throw new Error('not implemented');
    },

    loadStory: async (id: StoryId) => {
      return preview.storyById(id);
    },

    renderStoryToElement: (story: Story<AnyFramework>, element: HTMLElement) => {
      return preview.renderStoryToElement(story, element);
    },

    setMeta,
  };

  return (
    <DocsContext.Provider value={docsContext}>
      <SourceContainer>
        <ThemeProvider theme={ensure(themes.normal)}>{children}</ThemeProvider>
      </SourceContainer>
    </DocsContext.Provider>
  );
};

import React from 'react';

import { Preview, DocsContextProps } from '@storybook/preview-web';
import { Path, ModuleExports, StoryIndex, Story } from '@storybook/store';
import { toId, AnyFramework, ComponentTitle, StoryId, ProjectAnnotations } from '@storybook/csf';

import { DocsContext } from './DocsContext';

type StoryExport = any;
type MetaExport = any;
type ExportName = string;

class ConstantMap<TKey, TValue extends string> {
  entries = new Map<TKey, TValue>();

  // eslint-disable-next-line no-useless-constructor
  constructor(private prefix: string) {}

  get(key: TKey) {
    if (!this.entries.has(key)) {
      this.entries.set(key, `${this.prefix}${this.entries.size}` as TValue);
    }
    return this.entries.get(key);
  }
}

class ExternalPreview<TFramework extends AnyFramework> extends Preview<TFramework> {
  private initialized = false;

  private importPaths = new ConstantMap<MetaExport, Path>('./importPath/');

  private titles = new ConstantMap<MetaExport, ComponentTitle>('title-');

  private exportNames = new ConstantMap<StoryExport, ExportName>('story-');

  public storyIds = new Map<StoryExport, StoryId>();

  private storyIndex: StoryIndex = { v: 4, entries: {} };

  private moduleExportsByImportPath: Record<Path, ModuleExports> = {};

  constructor(public projectAnnotations: ProjectAnnotations) {
    super();
  }

  addStoryFromExports(storyExport: StoryExport, meta: MetaExport) {
    const importPath = this.importPaths.get(meta);
    const title = meta.title || this.titles.get(meta);

    const exportName = this.exportNames.get(storyExport);
    const storyId = toId(title, exportName);
    this.storyIds.set(storyExport, storyId);

    if (!this.moduleExportsByImportPath[importPath])
      this.moduleExportsByImportPath[importPath] = { default: meta };
    this.moduleExportsByImportPath[importPath][exportName] = storyExport;

    this.storyIndex.entries[storyId] = {
      id: storyId,
      importPath,
      title,
      name: 'Name',
      type: 'story',
    };

    if (!this.initialized) {
      return this.initialize({
        getStoryIndex: () => this.storyIndex,
        importFn: (path: Path) => {
          console.log(this.moduleExportsByImportPath, path);
          return Promise.resolve(this.moduleExportsByImportPath[path]);
        },
        getProjectAnnotations: () => this.projectAnnotations,
      });
    }
    // else
    return this.onStoriesChanged({ storyIndex: this.storyIndex });
  }

  storyById(storyId: StoryId) {
    const entry = this.storyIndex.entries[storyId];
    if (!entry) throw new Error(`Unknown storyId ${storyId}`);
    const { importPath, title } = entry;
    const moduleExports = this.moduleExportsByImportPath[importPath];
    const csfFile = this.storyStore.processCSFFileWithCache<TFramework>(
      moduleExports,
      importPath,
      title
    );
    return this.storyStore.storyFromCSFFile({ storyId, csfFile });
  }
}

let preview: ExternalPreview<AnyFramework>;

export const ExternalDocsContainer: React.FC<{ projectAnnotations: any }> = ({
  children,
  projectAnnotations,
}) => {
  if (!preview) preview = new ExternalPreview(projectAnnotations);

  let pageMeta: MetaExport;
  const setMeta = (m: MetaExport) => {
    pageMeta = m;
  };

  const docsContext: DocsContextProps = {
    type: 'external',

    id: 'external-docs',
    title: 'External',
    name: 'Docs',

    storyIdByModuleExport: (storyExport: StoryExport) => {
      if (!preview.storyIds.has(storyExport)) preview.addStoryFromExports(storyExport, pageMeta);
      return preview.storyIds.get(storyExport);
    },

    storyById: (id: StoryId) => {
      return preview.storyById(id);
    },

    getStoryContext: () => {
      throw new Error('not implemented');
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

  return <DocsContext.Provider value={docsContext}>{children}</DocsContext.Provider>;
};

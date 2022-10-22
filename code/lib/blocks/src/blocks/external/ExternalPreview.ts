/* eslint-disable camelcase */
import { Preview } from '@storybook/preview-web';
import type {
  Store_Path,
  Store_ModuleExports,
  Store_StoryIndex,
  AnyFramework,
  ComponentTitle,
  ProjectAnnotations,
} from '@storybook/types';
import { composeConfigs } from '@storybook/store';
import { Channel } from '@storybook/channels';

import { ExternalDocsContext } from './ExternalDocsContext';

type MetaExports = Store_ModuleExports;

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

export class ExternalPreview<
  TFramework extends AnyFramework = AnyFramework
> extends Preview<TFramework> {
  private importPaths = new ConstantMap<MetaExports, Store_Path>('./importPath/');

  private titles = new ConstantMap<MetaExports, ComponentTitle>('title-');

  private storyIndex: Store_StoryIndex = { v: 4, entries: {} };

  private moduleExportsByImportPath: Record<Store_Path, Store_ModuleExports> = {};

  constructor(public projectAnnotations: ProjectAnnotations) {
    super(new Channel());

    this.initialize({
      getStoryIndex: () => this.storyIndex,
      importFn: (path: Store_Path) => {
        return Promise.resolve(this.moduleExportsByImportPath[path]);
      },
      getProjectAnnotations: () =>
        composeConfigs([
          { parameters: { docs: { inlineStories: true } } },
          this.projectAnnotations,
        ]),
    });
  }

  processMetaExports = (metaExports: MetaExports) => {
    const importPath = this.importPaths.get(metaExports);
    this.moduleExportsByImportPath[importPath] = metaExports;

    const title = metaExports.default.title || this.titles.get(metaExports);

    const csfFile = this.storyStore.processCSFFileWithCache<TFramework>(
      metaExports,
      importPath,
      title
    );

    Object.values(csfFile.stories).forEach(({ id, name }) => {
      this.storyIndex.entries[id] = {
        id,
        importPath,
        title,
        name,
        type: 'story',
      };
    });

    this.onStoriesChanged({ storyIndex: this.storyIndex });

    return csfFile;
  };

  docsContext = () => {
    return new ExternalDocsContext(
      this.channel,
      this.storyStore,
      this.renderStoryToElement.bind(this),
      this.processMetaExports.bind(this)
    );
  };
}

import {
  AnyFramework,
  ComponentTitle,
  StoryContextForLoaders,
  StoryId,
  StoryName,
} from '@storybook/csf';
import { CSFFile, ModuleExport, ModuleExports, Story, StoryStore } from '@storybook/store';

import { DocsContextProps } from './DocsContextProps';

export class DocsContext<TFramework extends AnyFramework> implements DocsContextProps<TFramework> {
  private componentStoriesValue: Story<TFramework>[];

  private storyIdToCSFFile: Map<StoryId, CSFFile<TFramework>>;

  private exportToStoryId: Map<ModuleExport, StoryId>;

  private nameToStoryId: Map<StoryName, StoryId>;

  constructor(
    public readonly id: StoryId,
    public readonly title: ComponentTitle,
    public readonly name: StoryName,
    protected store: StoryStore<TFramework>,
    public renderStoryToElement: DocsContextProps['renderStoryToElement'],
    /** The CSF files known (via the index) to be refererenced by this docs file */
    csfFiles: CSFFile<TFramework>[],
    componentStoriesFromAllCsfFiles = true
  ) {
    this.storyIdToCSFFile = new Map();
    this.exportToStoryId = new Map();
    this.nameToStoryId = new Map();
    this.componentStoriesValue = [];

    csfFiles.forEach((csfFile, index) => {
      this.referenceCSFFile(csfFile, componentStoriesFromAllCsfFiles || index === 0);
    });
  }

  // This docs entry references this CSF file and can syncronously load the stories, as well
  // as reference them by module export. If the CSF is part of the "component" stories, they
  // can also be referenced by name and are in the componentStories list.
  referenceCSFFile(csfFile: CSFFile<TFramework>, addToComponentStories: boolean) {
    Object.values(csfFile.stories).forEach((annotation) => {
      this.storyIdToCSFFile.set(annotation.id, csfFile);
      this.exportToStoryId.set(annotation.moduleExport, annotation.id);

      if (addToComponentStories) {
        this.nameToStoryId.set(annotation.name, annotation.id);
        this.componentStoriesValue.push(this.storyById(annotation.id));
      }
    });
  }

  setMeta(metaExports: ModuleExports) {
    // Do nothing (this is really only used by external docs)
  }

  storyIdByModuleExport(storyExport: ModuleExport, metaExports?: ModuleExports) {
    const storyId = this.exportToStoryId.get(storyExport);
    if (storyId) return storyId;

    throw new Error(`No story found with that export: ${storyExport}`);
  }

  storyIdByName = (storyName: StoryName) => {
    const storyId = this.nameToStoryId.get(storyName);
    if (storyId) return storyId;

    throw new Error(`No story found with that name: ${storyName}`);
  };

  componentStories = () => {
    return this.componentStoriesValue;
  };

  storyById = (inputStoryId?: StoryId) => {
    const storyId = inputStoryId || this.id;
    const csfFile = this.storyIdToCSFFile.get(storyId);
    if (!csfFile)
      throw new Error(`Called \`storyById\` for story that was never loaded: ${storyId}`);
    return this.store.storyFromCSFFile({ storyId, csfFile });
  };

  getStoryContext = (story: Story<TFramework>) => {
    return {
      ...this.store.getStoryContext(story),
      viewMode: 'docs',
    } as StoryContextForLoaders<TFramework>;
  };

  loadStory = (id: StoryId) => {
    return this.store.loadStory({ storyId: id });
  };
}

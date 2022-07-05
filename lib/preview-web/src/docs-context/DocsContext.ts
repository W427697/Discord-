import {
  AnyFramework,
  ComponentTitle,
  StoryContextForLoaders,
  StoryId,
  StoryName,
} from '@storybook/csf';
import { CSFFile, ModuleExport, Story, StoryStore } from '@storybook/store';
import { PreviewWeb } from '../PreviewWeb';

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
    /** The CSF files known (via the index) to be refererenced by this docs file */
    public renderStoryToElement: PreviewWeb<TFramework>['renderStoryToElement'],
    csfFiles: CSFFile<TFramework>[],
    componentStoriesFromAllCsfFiles = true
  ) {
    this.storyIdToCSFFile = new Map();
    this.exportToStoryId = new Map();
    this.nameToStoryId = new Map();
    this.componentStoriesValue = [];

    csfFiles.forEach((csfFile, index) => {
      Object.values(csfFile.stories).forEach((annotation) => {
        this.storyIdToCSFFile.set(annotation.id, csfFile);
        this.exportToStoryId.set(annotation.moduleExport, annotation.id);
        this.nameToStoryId.set(annotation.name, annotation.id);

        if (componentStoriesFromAllCsfFiles || index === 0)
          this.componentStoriesValue.push(this.storyById(annotation.id));
      });
    });
  }

  setMeta() {
    // Do nothing
  }

  storyIdByModuleExport = (storyExport: ModuleExport) => {
    const storyId = this.exportToStoryId.get(storyExport);
    if (storyId) return storyId;

    throw new Error(`No story found with that export: ${storyExport}`);
  };

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

import type {
  Renderer,
  CSFFile,
  ModuleExport,
  ModuleExports,
  PreparedStory,
  StoryContextForLoaders,
  StoryId,
  StoryName,
  ComponentId,
} from '@storybook/types';
import type { Channel } from '@storybook/channels';
import type { StoryStore } from '../../store';

import type { DocsContextProps } from './DocsContextProps';

export class DocsContext<TRenderer extends Renderer> implements DocsContextProps<TRenderer> {
  private componentStoriesValue: PreparedStory<TRenderer>[];

  private storyIdToCSFFile: Map<StoryId, CSFFile<TRenderer>>;

  private exportToStoryId: Map<ModuleExport, StoryId>;

  private exportsToComponentId: Map<ModuleExports, ComponentId>;

  private nameToStoryId: Map<StoryName, StoryId>;

  private primaryStory?: PreparedStory<TRenderer>;

  constructor(
    public channel: Channel,
    protected store: StoryStore<TRenderer>,
    public renderStoryToElement: DocsContextProps['renderStoryToElement'],
    /** The CSF files known (via the index) to be refererenced by this docs file */
    csfFiles: CSFFile<TRenderer>[],
    componentStoriesFromAllCsfFiles = true
  ) {
    this.storyIdToCSFFile = new Map();
    this.exportToStoryId = new Map();
    this.exportsToComponentId = new Map();
    this.nameToStoryId = new Map();
    this.componentStoriesValue = [];

    csfFiles.forEach((csfFile, index) => {
      this.referenceCSFFile(csfFile, componentStoriesFromAllCsfFiles || index === 0);
    });
  }

  // This docs entry references this CSF file and can syncronously load the stories, as well
  // as reference them by module export. If the CSF is part of the "component" stories, they
  // can also be referenced by name and are in the componentStories list.
  referenceCSFFile(csfFile: CSFFile<TRenderer>, addToComponentStories: boolean) {
    this.exportsToComponentId.set(csfFile.moduleExports, csfFile.meta.id);
    // Also set the default export as the component's exports,
    // to allow `import ButtonStories from './Button.stories'`
    this.exportsToComponentId.set(csfFile.moduleExports.default, csfFile.meta.id);

    Object.values(csfFile.stories).forEach((annotation) => {
      this.storyIdToCSFFile.set(annotation.id, csfFile);
      this.exportToStoryId.set(annotation.moduleExport, annotation.id);
    });

    if (addToComponentStories) {
      this.store.componentStoriesFromCSFFile({ csfFile }).forEach((story) => {
        this.nameToStoryId.set(story.name, story.id);
        this.componentStoriesValue.push(story);
        if (!this.primaryStory) this.primaryStory = story;
      });
    }
  }

  setMeta(metaExports: ModuleExports) {
    // Do nothing (this is really only used by external docs)
  }

  componentOrStoryIdByModuleExport(moduleExport: ModuleExport, metaExports?: ModuleExports) {
    const componentId = this.exportsToComponentId.get(moduleExport);
    if (componentId) {
      return {
        type: 'component',
        id: componentId,
      } as const;
    }

    const storyId = this.exportToStoryId.get(moduleExport);
    if (storyId) {
      return {
        type: 'story',
        id: storyId,
      } as const;
    }

    throw new Error(`No story or component found with that export: ${moduleExport}`);
  }

  storyIdByName = (storyName: StoryName) => {
    const storyId = this.nameToStoryId.get(storyName);
    if (storyId) return storyId;

    throw new Error(`No story found with that name: ${storyName}`);
  };

  componentStories = () => {
    return this.componentStoriesValue;
  };

  storyById = (storyId?: StoryId) => {
    if (!storyId) {
      if (!this.primaryStory)
        throw new Error(
          `No primary story defined for docs entry. Did you forget to use \`<Meta>\`?`
        );

      return this.primaryStory;
    }
    const csfFile = this.storyIdToCSFFile.get(storyId);
    if (!csfFile)
      throw new Error(`Called \`storyById\` for story that was never loaded: ${storyId}`);
    return this.store.storyFromCSFFile({ storyId, csfFile });
  };

  getStoryContext = (story: PreparedStory<TRenderer>) => {
    return {
      ...this.store.getStoryContext(story),
      viewMode: 'docs',
    } as StoryContextForLoaders<TRenderer>;
  };

  loadStory = (id: StoryId) => {
    return this.store.loadStory({ storyId: id });
  };
}

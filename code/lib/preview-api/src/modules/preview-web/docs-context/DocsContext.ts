import type {
  Renderer,
  CSFFile,
  ModuleExport,
  ModuleExports,
  PreparedStory,
  StoryContextForLoaders,
  StoryId,
  StoryName,
} from '@storybook/types';
import type { Channel } from '@storybook/channels';
import type { StoryStore } from '../../store';

import type { DocsContextProps } from './DocsContextProps';

export class DocsContext<TRenderer extends Renderer> implements DocsContextProps<TRenderer> {
  private componentStoriesValue: PreparedStory<TRenderer>[];

  private storyIdToCSFFile: Map<StoryId, CSFFile<TRenderer>>;

  private exportToStory: Map<ModuleExport, PreparedStory<TRenderer>>;

  private exportsToCSFFile: Map<ModuleExports, CSFFile<TRenderer>>;

  private nameToStoryId: Map<StoryName, StoryId>;

  private primaryStory?: PreparedStory<TRenderer>;

  constructor(
    public channel: Channel,
    protected store: StoryStore<TRenderer>,
    public renderStoryToElement: DocsContextProps['renderStoryToElement'],
    /** The CSF files known (via the index) to be refererenced by this docs file */
    csfFiles: CSFFile<TRenderer>[]
  ) {
    this.storyIdToCSFFile = new Map();
    this.exportToStory = new Map();
    this.exportsToCSFFile = new Map();
    this.nameToStoryId = new Map();
    this.componentStoriesValue = [];

    csfFiles.forEach((csfFile, index) => {
      this.referenceCSFFile(csfFile);
    });
  }

  // This docs entry references this CSF file and can syncronously load the stories, as well
  // as reference them by module export. If the CSF is part of the "component" stories, they
  // can also be referenced by name and are in the componentStories list.
  referenceCSFFile(csfFile: CSFFile<TRenderer>) {
    this.exportsToCSFFile.set(csfFile.moduleExports, csfFile);
    // Also set the default export as the component's exports,
    // to allow `import ButtonStories from './Button.stories'`
    this.exportsToCSFFile.set(csfFile.moduleExports.default, csfFile);

    const stories = this.store.componentStoriesFromCSFFile({ csfFile });

    Object.values(csfFile.stories).forEach((annotation) => {
      this.storyIdToCSFFile.set(annotation.id, csfFile);
      const story = stories.find((s) => s.id === annotation.id);
      if (!story)
        throw new Error(`Unexpected missing story ${annotation.id} from referenced CSF file.`);
      this.exportToStory.set(annotation.moduleExport, story);
    });
  }

  attachCSFFile(csfFile: CSFFile<TRenderer>) {
    if (!this.exportsToCSFFile.has(csfFile.moduleExports)) {
      throw new Error('Cannot attach a CSF file that has not been referenced');
    }

    const stories = this.store.componentStoriesFromCSFFile({ csfFile });
    stories.forEach((story) => {
      this.nameToStoryId.set(story.name, story.id);
      this.componentStoriesValue.push(story);
      if (!this.primaryStory) this.primaryStory = story;
    });
  }

  setMeta(metaExports: ModuleExports) {
    const resolved = this.resolveModuleExport(metaExports);
    if (resolved.type !== 'meta')
      throw new Error('Cannot reference a non-meta or module export in <Meta of={} />');
    this.attachCSFFile(resolved.csfFile);
  }

  resolveModuleExport(moduleExport: ModuleExport, metaExports?: ModuleExports) {
    const csfFile = this.exportsToCSFFile.get(moduleExport);
    if (csfFile) {
      return {
        type: 'meta',
        csfFile,
      } as const;
    }

    const story = this.exportToStory.get(moduleExport);
    if (story) {
      return {
        type: 'story',
        story,
      } as const;
    }

    // If the export isn't a module, default or story export, we assume it is a component
    return {
      type: 'component',
      component: moduleExport,
    } as const;
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

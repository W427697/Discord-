import global from 'global';
import { AnyFramework, StoryId, ViewMode, StoryContextForLoaders } from '@storybook/csf';
import { Story, StoryStore, CSFFile, ModuleExports, IndexEntry } from '@storybook/store';
import { Channel } from '@storybook/addons';
import { DOCS_RENDERED } from '@storybook/core-events';

import { Render, RenderType } from './StoryRender';
import type { DocsContextProps } from './types';

export class DocsRender<TFramework extends AnyFramework> implements Render<TFramework> {
  public type: RenderType = 'docs';

  public id: StoryId;

  private legacy: boolean;

  public story?: Story<TFramework>;

  public exports?: ModuleExports;

  private preparing = false;

  private canvasElement?: HTMLElement;

  private context?: DocsContextProps;

  public disableKeyListeners = false;

  constructor(
    private channel: Channel,
    private store: StoryStore<TFramework>,
    public entry: IndexEntry
  ) {
    this.id = entry.id;
    this.legacy = entry.type === 'story' || entry.legacy;
  }

  // The two story "renders" are equal and have both loaded the same story
  isEqual(other?: Render<TFramework>) {
    return other && this.id === other.id && this.legacy
      ? this.story && this.story === other.story
      : other.type === 'docs' && this.entry === (other as DocsRender<TFramework>).entry;
  }

  async prepare() {
    this.preparing = true;
    if (this.legacy) {
      this.story = await this.store.loadStory({ storyId: this.id });
    } else {
      this.exports = await this.store.loadDocsFileById(this.id);
    }
    this.preparing = false;
  }

  isPreparing() {
    return this.preparing;
  }

  async renderToElement(
    canvasElement: HTMLElement,
    renderStoryToElement: DocsContextProps['renderStoryToElement']
  ) {
    this.canvasElement = canvasElement;

    const { id, title, name } = this.entry;
    const csfFile: CSFFile<TFramework> = await this.store.loadCSFFileByStoryId(this.id);

    this.context = {
      id,
      title,
      name,
      // NOTE: these two functions are *sync* so cannot access stories from other CSF files
      storyById: (storyId: StoryId) => this.store.storyFromCSFFile({ storyId, csfFile }),
      componentStories: () => this.store.componentStoriesFromCSFFile({ csfFile }),
      loadStory: (storyId: StoryId) => this.store.loadStory({ storyId }),
      renderStoryToElement,
      getStoryContext: (renderedStory: Story<TFramework>) =>
        ({
          ...this.store.getStoryContext(renderedStory),
          viewMode: 'docs' as ViewMode,
        } as StoryContextForLoaders<TFramework>),
      // Put all the storyContext fields onto the docs context for back-compat
      ...(!global.FEATURES?.breakingChangesV7 && this.store.getStoryContext(this.story)),
    };

    return this.render();
  }

  async render() {
    if (!(this.story || this.exports) || !this.context || !this.canvasElement)
      throw new Error('DocsRender not ready to render');

    const renderer = await import('./renderDocs');

    if (this.legacy) {
      renderer.renderLegacyDocs(this.story, this.context, this.canvasElement, () =>
        this.channel.emit(DOCS_RENDERED, this.id)
      );
    } else {
      renderer.renderDocs(this.exports, this.context, this.canvasElement, () =>
        this.channel.emit(DOCS_RENDERED, this.id)
      );
    }
  }

  async rerender() {
    // NOTE: in modern inline render mode, each story is rendered via
    // `preview.renderStoryToElement` which means the story will track
    // its own re-renders. Thus there will be no need to re-render the whole
    // docs page when a single story changes.
    if (!global.FEATURES?.modernInlineRender) await this.render();
  }

  async teardown({ viewModeChanged }: { viewModeChanged?: boolean } = {}) {
    if (!viewModeChanged || !this.canvasElement) return;
    const renderer = await import('./renderDocs');
    renderer.unmountDocs(this.canvasElement);
  }
}

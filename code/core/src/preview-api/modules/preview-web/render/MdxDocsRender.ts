import type { Channel } from '@storybook/core/dist/channels';
import { DOCS_RENDERED } from '@storybook/core/dist/core-events';
import type { StoryStore } from '../../store';

import type { Render, RenderType } from './Render';
import { PREPARE_ABORTED } from './Render';
import type { DocsContextProps } from '../docs-context/DocsContextProps';
import type { DocsRenderFunction } from '../docs-context/DocsRenderFunction';
import { DocsContext } from '../docs-context/DocsContext';
import type { Renderer, StoryId } from '@storybook/core/dist/types';
import type { CSFFile, ModuleExports } from '@storybook/core/dist/types';
import type { IndexEntry } from '@storybook/core/dist/types';
import type { RenderContextCallbacks } from '@storybook/core/dist/types';

/**
 * A MdxDocsRender is a render of a docs entry that comes from a true MDX file,
 * that is a `.mdx` file that doesn't get compiled to a CSF file.
 *
 * A MDX render can reference (import) zero or more CSF files that contain stories.
 *
 * Use cases:
 *  - *.mdx file that may or may not reference a specific CSF file with `<Meta of={} />`
 */

export class MdxDocsRender<TRenderer extends Renderer> implements Render<TRenderer> {
  public readonly type: RenderType = 'docs';

  public readonly subtype = 'mdx';

  public readonly id: StoryId;

  private exports?: ModuleExports;

  public rerender?: () => Promise<void>;

  public teardownRender?: (options: { viewModeChanged?: boolean }) => Promise<void>;

  public torndown = false;

  public readonly disableKeyListeners = false;

  public preparing = false;

  public csfFiles?: CSFFile<TRenderer>[];

  constructor(
    protected channel: Channel,
    protected store: StoryStore<TRenderer>,
    public entry: IndexEntry,
    private callbacks: RenderContextCallbacks<TRenderer>
  ) {
    this.id = entry.id;
  }

  isPreparing() {
    return this.preparing;
  }

  async prepare() {
    this.preparing = true;
    const { entryExports, csfFiles = [] } = await this.store.loadEntry(this.id);
    if (this.torndown) throw PREPARE_ABORTED;

    this.csfFiles = csfFiles;
    this.exports = entryExports;

    this.preparing = false;
  }

  isEqual(other: Render<TRenderer>): boolean {
    return !!(
      this.id === other.id &&
      this.exports &&
      this.exports === (other as MdxDocsRender<TRenderer>).exports
    );
  }

  docsContext(renderStoryToElement: DocsContextProps<TRenderer>['renderStoryToElement']) {
    if (!this.csfFiles) throw new Error('Cannot render docs before preparing');

    // NOTE we do *not* attach any CSF file yet. We wait for `referenceMeta(..., true)`
    // ie the CSF file is attached via `<Meta of={} />`
    return new DocsContext<TRenderer>(
      this.channel,
      this.store,
      renderStoryToElement,
      this.csfFiles
    );
  }

  async renderToElement(
    canvasElement: TRenderer['canvasElement'],
    renderStoryToElement: DocsContextProps<TRenderer>['renderStoryToElement']
  ) {
    if (!this.exports || !this.csfFiles || !this.store.projectAnnotations)
      throw new Error('Cannot render docs before preparing');

    const docsContext = this.docsContext(renderStoryToElement);

    const { docs } = this.store.projectAnnotations.parameters || {};
    if (!docs)
      throw new Error(
        `Cannot render a story in viewMode=docs if \`@storybook/addon-docs\` is not installed`
      );

    const docsParameter = { ...docs, page: this.exports.default };
    const renderer = await docs.renderer();
    const { render } = renderer as { render: DocsRenderFunction<TRenderer> };
    const renderDocs = async () => {
      try {
        // NOTE: it isn't currently possible to use a docs renderer outside of "web" mode.
        await render(docsContext, docsParameter, canvasElement as any);
        this.channel.emit(DOCS_RENDERED, this.id);
      } catch (err) {
        this.callbacks.showException(err as Error);
      }
    };

    this.rerender = async () => renderDocs();
    this.teardownRender = async ({ viewModeChanged }: { viewModeChanged?: boolean } = {}) => {
      if (!viewModeChanged || !canvasElement) return;
      renderer.unmount(canvasElement);
      this.torndown = true;
    };

    return renderDocs();
  }

  async teardown({ viewModeChanged }: { viewModeChanged?: boolean } = {}) {
    this.teardownRender?.({ viewModeChanged });
    this.torndown = true;
  }
}

import type { Renderer, CSFFile, ModuleExports, DocsContextProps } from '@junk-temporary-prototypes/types';
import { DocsContext } from '@junk-temporary-prototypes/preview-api';
import type { StoryStore } from '@junk-temporary-prototypes/preview-api';
import type { Channel } from '@junk-temporary-prototypes/channels';

export class ExternalDocsContext<TRenderer extends Renderer> extends DocsContext<TRenderer> {
  constructor(
    public channel: Channel,
    protected store: StoryStore<TRenderer>,
    public renderStoryToElement: DocsContextProps['renderStoryToElement'],
    private processMetaExports: (metaExports: ModuleExports) => CSFFile<TRenderer>
  ) {
    super(channel, store, renderStoryToElement, []);
  }

  referenceMeta = (metaExports: ModuleExports, attach: boolean) => {
    const csfFile = this.processMetaExports(metaExports);
    this.referenceCSFFile(csfFile);
    super.referenceMeta(metaExports, attach);
  };
}

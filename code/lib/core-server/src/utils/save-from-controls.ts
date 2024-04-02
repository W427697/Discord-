import type { CoreConfig } from '@storybook/types';
import type { Channel } from '@storybook/channels';
import { SAVE_STORY_REQUEST, SAVE_STORY_RESULT } from '@storybook/core-events';
import type { OptionsWithRequiredCache } from './whats-new';
import { readCsf, writeCsf } from '@storybook/csf-tools';
// import { sendTelemetryError } from '../withTelemetry';

interface RequestSaveStoryPayload {
  // The id of the request. It might be simply the story Title
  id: string;
  // The path of the Story
  importPath: string;
  // The updated list of set args
  args: Record<string, any>;
  // The exported name of the Story -> This information doesn't exist in the index.json yet.
  name: string;
}

export function initializeSaveFromControls(
  channel: Channel,
  options: OptionsWithRequiredCache,
  coreOptions: CoreConfig
) {
  channel.on(SAVE_STORY_REQUEST, async (data: RequestSaveStoryPayload) => {
    try {
      // open the story file
      const csf = await readCsf(data.importPath, { makeTitle: () => data.name });
      const parsed = csf.parse();

      // find the AST node for the story
      const found = !!parsed.stories.find((s) => s.id === data.id);
      let node = csf.getStoryExport(data.id);

      // if none can be found, create one
      if (!found) {
        // @ts-expect-error (TODO)
        node = undefined;
        throw new Error(`creation of new story: not yet implemented`);
      }

      // modify the AST node with the new args
      // node

      // save the file
      await writeCsf(csf);

      channel.emit(SAVE_STORY_RESULT, { id: data.id, success: true });
    } catch (e) {
      // sendTelemetryError(channel, e);
      channel.emit(SAVE_STORY_RESULT, { id: data.id, success: false });
    }
  });
}

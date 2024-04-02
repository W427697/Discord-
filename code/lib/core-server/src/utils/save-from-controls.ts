import type { CoreConfig } from '@storybook/types';
import type { Channel } from '@storybook/channels';
import { SAVE_STORY_REQUEST, SAVE_STORY_RESULT } from '@storybook/core-events';
import type { OptionsWithRequiredCache } from './whats-new';
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
    // TODO: Implement the save story logic

    channel.emit(SAVE_STORY_RESULT, { id: data.id, success: true });
  });
}

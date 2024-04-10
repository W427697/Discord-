/* eslint-disable no-underscore-dangle */
import type { CoreConfig } from '@storybook/types';
import type { Channel } from '@storybook/channels';
import { SAVE_STORY_REQUEST, SAVE_STORY_RESULT } from '@storybook/core-events';
import type { OptionsWithRequiredCache } from './whats-new';
import { readCsf, writeCsf } from '@storybook/csf-tools';
import { join } from 'path';
// import { sendTelemetryError } from '../withTelemetry';

interface RequestSaveStoryPayload {
  // The id of the request. It might be simply the story Title
  id: string;
  // The path of the Story
  importPath: string;
  // The updated list of set args
  args: Record<string, any>;
  // The exported name of the Story -> This information doesn't exist in the index.json yet.
  name?: string;
}

export function initializeSaveFromControls(
  channel: Channel,
  options: OptionsWithRequiredCache,
  coreOptions: CoreConfig
) {
  channel.on(SAVE_STORY_REQUEST, async (data: RequestSaveStoryPayload) => {
    console.log('SAVE_STORY_REQUEST', data);
    const id = data.id.split('--')[1];
    try {
      const location = join(process.cwd(), data.importPath);
      console.log({ location });
      // open the story file
      const csf = await readCsf(location, {
        makeTitle: (userTitle: string) => userTitle,
      });

      const parsed = csf.parse();
      // console.log(parsed._stories);

      // find the AST node for the story

      const [name, result] =
        Object.entries(parsed._stories).find(([key, value]) => value.id.endsWith(`--${id}`)) || [];

      console.log({ name, result });
      let node;

      // if none can be found, create one
      if (!name) {
        node = undefined;
        throw new Error(`creation of new story: not yet implemented`);
      } else {
        node = csf.getStoryExport(name);
      }

      // modify the AST node with the new args
      // node
      console.log({ node });

      // save the file
      await writeCsf(csf, location);

      channel.emit(SAVE_STORY_RESULT, { id: data.id, success: true });
    } catch (e: any) {
      // sendTelemetryError(channel, e);
      channel.emit(SAVE_STORY_RESULT, {
        id: data.id,
        success: false,
        error: e.stack || e.message || e.toString(),
      });
    }
  });
}

import type { Options } from '@storybook/types';
import type { Channel } from '@storybook/channels';
import { initFileSearchChannel } from './server-channel/file-search-channel';
import { initCreateNewStoryChannel } from './server-channel/create-new-story-channel';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const experimental_serverChannel = async (channel: Channel, options: Options) => {
  initCreateNewStoryChannel(channel, options);
  initFileSearchChannel(channel, options);

  return channel;
};

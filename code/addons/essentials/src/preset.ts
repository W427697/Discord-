// @ts-expect-error no types
import { experimental_serverChannel as experimentalServerChannelControls } from '@storybook/addon-controls/preset';

import type { Channel } from '@storybook/channels';
import type { Options } from '@storybook/types';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const experimental_serverChannel = async (channel: Channel, options: Options) => {
  experimentalServerChannelControls(channel, options);

  return channel;
};

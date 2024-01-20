import { Channel } from '@storybook/core/dist/modules/channels/index';

export function mockChannel() {
  const transport = {
    setHandler: () => {},
    send: () => {},
  };

  return new Channel({ transport });
}

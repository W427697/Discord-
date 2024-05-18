import { Channel } from '@storybook/core/dist/channels';

export function mockChannel() {
  const transport = {
    setHandler: () => {},
    send: () => {},
  };

  return new Channel({ transport });
}

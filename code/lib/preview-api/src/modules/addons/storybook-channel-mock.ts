import { Channel } from '@junk-temporary-prototypes/channels';

export function mockChannel() {
  const transport = {
    setHandler: () => {},
    send: () => {},
  };

  return new Channel({ transport });
}

export async function generateAddonSetupCode() {
  return `
    import { createChannel as createPostMessageChannel } from '@junk-temporary-prototypes/channel-postmessage';
    import { createChannel as createWebSocketChannel } from '@junk-temporary-prototypes/channel-websocket';
    import { addons } from '@junk-temporary-prototypes/preview-api';

    const channel = createPostMessageChannel({ page: 'preview' });
    addons.setChannel(channel);
    window.__STORYBOOK_ADDONS_CHANNEL__ = channel;

    const { SERVER_CHANNEL_URL } = globalThis;
    if (SERVER_CHANNEL_URL) {
      const serverChannel = createWebSocketChannel({ url: SERVER_CHANNEL_URL });
      addons.setServerChannel(serverChannel);
      window.__STORYBOOK_SERVER_CHANNEL__ = serverChannel;
    }
  `.trim();
}

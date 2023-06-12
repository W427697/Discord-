export async function generateAddonSetupCode() {
  return `
    import { createPostMessageChannel } from '@storybook/channels';
    import { addons } from '@storybook/preview-api';

    const channel = createPostMessageChannel({ page: 'preview' });
    addons.setChannel(channel);
    window.__STORYBOOK_ADDONS_CHANNEL__ = channel;
    
    if (window.CONFIG_TYPE === 'DEVELOPMENT'){
      window.__STORYBOOK_SERVER_CHANNEL__ = channel;
    }
  `.trim();
}

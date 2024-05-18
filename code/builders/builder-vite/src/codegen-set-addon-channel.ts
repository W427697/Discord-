export async function generateAddonSetupCode() {
  return `
    import { createBrowserChannel } from '@storybook/core/dist/channels';
    import { addons } from '@storybook/core/dist/preview-api';

    const channel = createBrowserChannel({ page: 'preview' });
    addons.setChannel(channel);
    window.__STORYBOOK_ADDONS_CHANNEL__ = channel;
    
    if (window.CONFIG_TYPE === 'DEVELOPMENT'){
      window.__STORYBOOK_SERVER_CHANNEL__ = channel;
    }
  `.trim();
}

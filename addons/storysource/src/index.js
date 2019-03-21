import createChannel from '@storybook/channel-postmessage';
import { fetch } from 'global';
import { ADDON_ID, PANEL_ID, STORY_EVENT_ID, SAVE_FILE_EVENT_ID } from './events';
import { withStorySource } from './preview';

export { ADDON_ID, PANEL_ID, STORY_EVENT_ID, SAVE_FILE_EVENT_ID, withStorySource };

const channel = createChannel({ page: 'manager' });

const saveFile = ({ fileName, content }) => {
  if (!module || !module.hot || !module.hot.active) {
    // eslint-disable-next-line no-console
    console.debug('This feature works in dev server mode only');
    return;
  }
  // eslint-disable-next-line no-console
  console.debug(`Asking to update the file ${fileName}`);
  fetch(`/save-file/${encodeURIComponent(fileName)}`, { method: 'PUT', body: content });
};

channel.on(SAVE_FILE_EVENT_ID, saveFile);

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}

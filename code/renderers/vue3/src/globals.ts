import { global } from '@storybook/global';

const { window: globalWindow } = global as any;

globalWindow.STORYBOOK_ENV = 'vue3';
globalWindow.PLUGINS_SETUP_FUNCTIONS ||= [];

export { globalWindow };

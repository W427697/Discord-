import { global } from '@junk-temporary-prototypes/global';

const { window: globalWindow } = global;

if (globalWindow) {
  globalWindow.STORYBOOK_ENV = 'preact';
}

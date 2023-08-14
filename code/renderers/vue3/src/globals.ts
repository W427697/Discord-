import { global } from '@storybook/global';

const { window: globalWindow } = global;

globalWindow.STORYBOOK_ENV = 'vue3';
globalWindow.STORYBOOK_VUE_GLOBAL_PLUGINS ||= [];
globalWindow.STORYBOOK_VUE_GLOBAL_MIXINS ||= [];

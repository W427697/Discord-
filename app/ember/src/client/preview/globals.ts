import global from 'global';

const { window: globalWindow } = global;

globalWindow.STORYBOOK_NAME = process.env.STORYBOOK_NAME;
globalWindow.STORYBOOK_ENV = 'ember';
globalWindow.STORYBOOK_REQUIRE_ALIAS = process.env.STORYBOOK_REQUIRE_ALIAS;

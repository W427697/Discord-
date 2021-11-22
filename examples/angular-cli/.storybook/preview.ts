/* eslint-disable */
import addCssWarning from "../src/cssWarning";
import docJson from '../documentation.json';
import { setCompodocJson } from '@storybook/addon-docs/angular';

// @ts-ignore
window.STORYBOOK_ANGULAR_COMPONENT_ARGS = process.env.STORYBOOK_ANGULAR_COMPONENT_ARGS;
console.log((window as any).STORYBOOK_ANGULAR_COMPONENT_ARGS);


const filtered = !docJson?.components
  ? docJson
  : {
      ...docJson,
      components: docJson.components.filter((c) => c.name !== 'ButtonComponent'),
    };
setCompodocJson(filtered);

addCssWarning();

export const parameters = {
  docs: {
    inlineStories: true,
  },
  options: {
    storySort: {
      order: ['Welcome', 'Core ', 'Addons ', 'Basics '],
    },
  },
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'paintbrush',
      items: [
        { value: 'light', title: 'Light theme' },
        { value: 'dark', title: 'Dark theme' },
      ],
    },
  },
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', right: '🇺🇸', title: 'English' },
        { value: 'es', right: '🇪🇸', title: 'Español' },
        { value: 'zh', right: '🇨🇳', title: '中文' },
        { value: 'kr', right: '🇰🇷', title: '한국어' },
      ],
    },
  },
};

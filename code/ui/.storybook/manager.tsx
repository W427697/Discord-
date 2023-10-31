import React from 'react';
import { addons, types } from '@storybook/manager-api';
import startCase from 'lodash/startCase.js';
import type { ThemeVars } from '@storybook/theming';

const customTheme: ThemeVars = {
  base: 'light',

  // Storybook-specific color palette
  colorPrimary: '#fff947', // coral
  colorSecondary: '#fd02cb', // ocean

  // UI
  appBg: '#10a7f2',
  appContentBg: '#dfc21e',
  appBorderColor: 'rgba(237, 149, 149, 0.1)',
  appBorderRadius: 4,

  // Fonts
  fontBase: 'system-ui, sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: '#C9CDCF',
  textInverseColor: '#222425',
  textMutedColor: '#798186',

  // Toolbar default and active colors
  barTextColor: '#798186',
  barHoverColor: '#C9CDCF',
  barSelectedColor: '#fff',
  barBg: '#292C2E',

  // Form colors
  buttonBg: '#222425',
  buttonBorder: 'rgba(255,255,255,.1)',
  booleanBg: '#222425',
  booleanSelectedBg: '#2E3438',
  inputBg: '#1B1C1D',
  inputBorder: 'rgba(255,255,255,.1)',
  inputTextColor: '#C9CDCF',
  inputBorderRadius: 4,
};

addons.setConfig({
  sidebar: {
    renderLabel: ({ name, type }) => (type === 'story' ? name : startCase(name)),
  },
  theme: customTheme,
});

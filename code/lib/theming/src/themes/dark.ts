import { color, typography } from '../base';
import type { ThemeVars } from '../types';

const theme: ThemeVars = {
  base: 'dark',

  // Storybook-specific color palette
  colorPrimary: '#FF4785', // coral
  colorSecondary: '#029CFD', // ocean

  // UI
  appBg: '#222425', // should be accent/sidebar
  appContentBg: '#1B1C1D', // should only be used for the content area
  appBorderColor: 'rgba(255,255,255,.1)',
  appBorderRadius: 4,

  // Fonts
  fontBase: typography.fonts.base,
  fontCode: typography.fonts.mono,

  // Text colors
  textColor: '#C9CDCF',
  textInverseColor: '#222425',
  textMutedColor: '#798186',

  // Toolbar default and active colors
  barTextColor: '#798186',
  barSelectedColor: color.secondary,
  barBg: '#292C2E',

  // Form colors
  inputBg: '#3f3f3f',
  inputBorder: 'rgba(0,0,0,.3)',
  inputTextColor: color.lightest,
  inputBorderRadius: 4,
};

export default theme;

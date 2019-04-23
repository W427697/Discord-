import emotionStyled, { CreateStyled } from '@emotion/styled';
import dark from './themes/dark';
import light from './themes/light';
import { Theme } from './base';

export const styled = emotionStyled as CreateStyled<Theme>;

export * from './base';

const themes = {
  dark,
  normal: light,
  light,
};

export { themes };

import { Global, keyframes, css, ClassNames } from '@emotion/core';
// export * from '@emotion/core';
export { Global, keyframes, css, ClassNames };

import { ThemeProvider, withTheme } from 'emotion-theming';
// export * from 'emotion-theming';
export { withTheme, ThemeProvider };

export { createGlobal, createReset } from './global';

export * from './create';
export * from './ensure';

import emotionStyled, { CreateStyled } from '@emotion/styled';

// import { Global, keyframes, css, ClassNames } from '@emotion/core';
// import { ThemeProvider, withTheme } from 'emotion-theming';
// import dark from './themes/dark';
// import light from './themes/light';

import { Theme } from './types';

export const styled = emotionStyled as CreateStyled<Theme>;

export * from './base';
// const themes = {
//   dark,
//   normal: light,
//   light,
// };

// export { themes };
// // export * from '@emotion/core';
// export { Global, keyframes, css, ClassNames };
// // export * from 'emotion-theming';
// export { withTheme, ThemeProvider };

export * from './types';

export * from '@emotion/core';
export * from 'emotion-theming';

export { createGlobal, createReset } from './global';

export * from './create';
export * from './convert';
export * from './ensure';

import { createTheme, createThemeContract } from '@vanilla-extract/css';

const defaultTheme = {
  space: {
    none: '0px',
    small: '4px',
    medium: '8px',
    large: '12px',
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'system-ui',
  },
  fontSizes: {
    'x-small': '10px',
    small: '12px',
    medium: '16px',
    large: '24px',
    'x-large': '32px',
  },
  fontWeights: {
    normal: 'normal',
    bold: 'bold',
  },
  colors: {
    background: 'white',
    text: 'black',
    muted: '#efefef',
  },
};

const theme = createThemeContract(defaultTheme);

// const space = createThemeContract({
//   none: '0px',
//   small: '4px',
//   medium: '8px',
//   large: '12px',
// });
//
// const fonts = createThemeContract({
//   heading: 'Inter, sans-serif',
//   body: 'system-ui',
// });
//
// const fontWeights = createThemeContract({
//   light: 300,
//   normal: 400,
//   bold: 700,
// });
//
// const fontSizes = createThemeContract({
//   'x-small': '10px',
//   small: '12px',
//   medium: '16px',
//   large: '24px',
//   'x-large': '32px',
// });
//
// const colors = createThemeContract({
//   background: null,
//   text: null,
// });

export const lightTheme = createTheme(theme, {
  ...defaultTheme,
  colors: {
    background: 'white',
    text: 'black',
    muted: '#efefef',
  },
});

export const darkTheme = createTheme(theme, {
  ...defaultTheme,
  colors: {
    background: 'black',
    text: 'white',
    muted: '#333',
  },
});

export const vars = { ...theme };

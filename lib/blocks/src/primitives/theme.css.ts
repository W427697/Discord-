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

export const lightTheme = createTheme(theme, {
  ...defaultTheme,
  colors: {
    background: 'white',
    text: 'black',
    muted: '#bbb',
  },
});

export const darkTheme = createTheme(theme, {
  ...defaultTheme,
  colors: {
    background: 'black',
    text: 'white',
    muted: '#888',
  },
});

export const vars = { ...theme };

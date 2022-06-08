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
    s1: '12px',
    s2: '14px',
    s3: '16px',
    m1: '20px',
    m2: '24px',
    m3: '28px',
    l1: '32px',
    l2: '40px',
    l3: '48px',
  },
  fontWeights: {
    normal: '400',
    bold: '700',
    black: '900',
  },
  colors: {
    background: 'white',
    text: 'black',
    muted: 'rgba(0,0,0,.1)',
  },
  borderRadius: {
    none: '0px',
    small: '4px',
    round: '99999px',
  },
};

const theme = createThemeContract(defaultTheme);

export const lightTheme = createTheme(theme, {
  ...defaultTheme,
  colors: {
    background: 'white',
    text: 'black',
    muted: 'rgba(0,0,0,.125)',
  },
});

export const darkTheme = createTheme(theme, {
  ...defaultTheme,
  colors: {
    background: 'black',
    text: 'white',
    muted: 'rgba(255,255,255,.25)',
  },
});

export const vars = { ...theme };

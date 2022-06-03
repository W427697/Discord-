import React from 'react';
import { Global, ThemeProvider, themes, createReset, convert } from '@storybook/theming';
import { VanillaThemeProvider } from '../src/primitives/VanillaThemeProvider/VanillaThemeProvider';

// TODO: Derive this from breakpoints in the theme
const customViewports = {
  mobile: {
    name: 'mobile',
    styles: {
      width: '360px',
      height: '963px',
    },
  },
  tablet: {
    name: 'tablet',
    styles: {
      width: '768px',
      height: '801px',
    },
  },
  desktop: {
    name: 'desktop',
  },
};

export const parameters = {
  viewport: {
    viewports: {
      ...customViewports,
    },
  },
};

export const decorators = [
  (StoryFn) => (
    <ThemeProvider theme={convert(themes.light)}>
      <Global styles={createReset} />
      <VanillaThemeProvider>
        <StoryFn />
      </VanillaThemeProvider>
    </ThemeProvider>
  ),
];

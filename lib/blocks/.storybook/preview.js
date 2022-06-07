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

// .storybook/preview.js

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for blocks',
    defaultValue: 'light',
    toolbar: {
      icon: 'paintbrush',
      // Array of plain string values or MenuItem shape (see below)
      items: ['light', 'dark'],
      // Property that specifies if the name of the item will be displayed
      showName: true,
      // Change title based on selected value
      dynamicTitle: true,
    },
  },
};

export const decorators = [
  (StoryFn, context) => (
    <ThemeProvider theme={convert(themes.light)}>
      <Global styles={createReset} />
      <VanillaThemeProvider theme={context.globals.theme}>
        <StoryFn />
      </VanillaThemeProvider>
    </ThemeProvider>
  ),
];

import React from 'react';
import { ThemeProvider, convert, themes } from '@storybook/theming';

export const parameters = {
  options: {
    storySort: {
      order: ['Examples', 'Docs', 'Demo'],
    },
  },
};

export const decorators = [
  (StoryFn) => (
    <ThemeProvider theme={convert(themes.light)}>
      <StoryFn />
    </ThemeProvider>
  ),
];

import React from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from 'emotion-theming';

import { configure, addParameters, addDecorator } from '@storybook/react';
import { themes } from '@storybook/theming';

import { configureViewport } from '@storybook/addon-viewport';
import centered from '@storybook/addon-centered';

const Reset = styled.div(({ theme }) => ({
  fontFamily: theme.mainTextFace,
  color: theme.mainTextColor,
  WebkitFontSmoothing: 'antialiased',
  fontSize: theme.mainTextSize,
}));

addParameters({
  options: {
    hierarchySeparator: /\/|\./,
    hierarchyRootSeparator: '|',
  },
});
addDecorator(story => <Reset>{story()}</Reset>);
addDecorator(centered);
addDecorator(story => <ThemeProvider theme={themes.normal}>{story()}</ThemeProvider>);

configureViewport({
  viewports: {
    responsive: {
      name: 'Responsive',
      styles: {
        width: '100%',
        height: '100%',
        border: 'none',
        display: 'block',
        boxShadow: 'none',
        borderRadius: '0',
        margin: '0',
      },
      type: 'desktop',
    },
    iphone5: {
      name: 'iPhone 5',
      styles: {
        width: '320px',
        height: '568px',
      },
      type: 'mobile',
    },
    iphonexsmax: {
      name: 'iPhone XLs Max',
      styles: {
        width: '414px',
        height: '896px',
      },
      type: 'mobile',
    },
    ipad: {
      name: 'iPad',
      styles: {
        width: '768px',
        height: '1024px',
      },
      type: 'tablet',
    },
  },
});

configure(
  [
    require.context('./components', true, /\.stories\.js$/),
    require.context('./slides', true, /\.js$/),
  ],
  module
);

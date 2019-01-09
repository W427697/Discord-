import React from 'react';
import { ThemeProvider, withTheme } from 'emotion-theming';
import { Global } from '@emotion/core';
import { withA11Y } from '@storybook/addon-a11y';

import { configure, addParameters, addDecorator } from '@storybook/react';
import { themes } from '@storybook/components';

import centered from '@storybook/addon-centered';

import 'react-chromatic/storybook-addon';

const Reset = withTheme(({ theme }) => (
  <Global
    styles={{
      body: {
        fontFamily: theme.mainTextFace,
        color: theme.mainTextColor,
        WebkitFontSmoothing: 'antialiased',
        fontSize: theme.mainTextSize,
      },
    }}
  />
));

addParameters({
  options: {
    hierarchySeparator: /\/|\./,
    hierarchyRootSeparator: '|',
  },
  backgrounds: [{ name: 'light', value: '#efefef' }, { name: 'dark', value: '#222222' }],
  viewports: {
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

addDecorator(withA11Y);
addDecorator(centered);
addDecorator(fn => (
  <ThemeProvider theme={themes.normal}>
    <Reset />
    {fn()}
  </ThemeProvider>
));

function importAll(req) {
  req.keys().forEach(filename => req(filename));
}

function loadStories() {
  let req;

  req = require.context('./components', true, /\.stories\.js$/);
  importAll(req);

  req = require.context('./slides', true, /\.js$/);
  importAll(req);

  req = require.context('./other', true, /\.js$/);
  importAll(req);
}

configure(loadStories, module);

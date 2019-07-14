import { load, addParameters, addDecorator } from '@storybook/html';
import { withA11y } from '@storybook/addon-a11y';
import withReact from '@storybook/addon-react';
import { ThemeProvider, themes, convert } from '@storybook/theming';
import { useParameter } from '@storybook/client-api';
import React from 'react';

addDecorator(withA11y);

addDecorator(getStory => {
  const story = getStory();
  const framework = useParameter('framework');
  if (framework !== 'react') {
    return story;
  }

  return <ThemeProvider theme={convert(themes.light)}>{story}</ThemeProvider>;
});
addDecorator(withReact);

addParameters({
  a11y: {
    config: {},
    options: {
      checks: { 'color-contrast': { options: { noScroll: true } } },
      restoreScroll: true,
    },
  },
  options: {
    hierarchyRootSeparator: /\|/,
  },
});

load(require.context('../stories', true, /\.stories\.js$/), module);

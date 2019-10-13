import '@storybook/renderer-react/register';
import { configure, addParameters, addDecorator } from '@storybook/html';
import { withA11y } from '@storybook/addon-a11y';
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
  docs: {
    iframeHeight: '200px',
  },
});

configure(require.context('../stories', true, /\.stories\.(js|mdx)$/), module);

import { configure, addParameters, addDecorator } from '@storybook/lit-element';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withA11y);

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
    docs: {
      iframeHeight: '200px',
    },
  },
});

configure(require.context('../src/stories', true, /\.stories\.(js|mdx)$/), module);

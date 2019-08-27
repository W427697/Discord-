import { configure, addDecorator, addParameters } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withA11y);
addParameters({
  options: {
    brandTitle: 'CRA TypeScript Kitchen Sink',
    brandUrl: 'https://github.com/storybookjs/storybook/tree/master/examples/cra-ts-kitchen-sink',
  },
});

configure(require.context('../src', true, /\.stories\.(js|jsx|ts|tsx|mdx)$/), module);

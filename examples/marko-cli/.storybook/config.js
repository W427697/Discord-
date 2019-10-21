import { configure, addParameters, addDecorator } from '@storybook/marko';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withA11y);
addParameters({
  consistentNames: true,
  options: {
    hierarchyRootSeparator: /\|/,
  },
});

configure(require.context('../src/stories', true, /\.stories\.js$/), module);

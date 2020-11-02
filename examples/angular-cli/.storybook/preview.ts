import { addParameters } from '@storybook/angular';
import { setTypedocJson } from '@storybook/addon-docs/angular';
import addCssWarning from '../src/cssWarning';
import docJson from '../documentation.json';

setTypedocJson(docJson);

addCssWarning();

addParameters({
  docs: {
    // inlineStories: true,
    iframeHeight: '60px',
  },
});

import { extractArgTypes } from './extractArgTypes';
import { extractComponentDescription } from '../../lib/docgen';
import { isVue3 } from './vue';

let prepareForInline;
let sourceDecorator;
if (isVue3) {
  prepareForInline = require('./v3/prepareForInline').prepareForInline;
  sourceDecorator = require('./v3/sourceDecorator').sourceDecorator;
} else {
  prepareForInline = require('./v2/prepareForInline').prepareForInline;
  sourceDecorator = require('./v2/sourceDecorator').sourceDecorator;
}

export const parameters = {
  docs: {
    inlineStories: true,
    prepareForInline,
    extractArgTypes,
    extractComponentDescription,
  },
};

export const decorators = [sourceDecorator];

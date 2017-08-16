import Widget from './widget';
import markdown from './summary.md';
import { defaultOptions, defaultMarksyConf } from '../../../defaults';

const widgetProps = {
  size: 30,
  backgroundColor: 'coral',
};

const widgetSummary = `
# Widget mock

This is example React component to be used for testing addon-info

## Contains

- prop types
- default props
- prop decriptions

### prop types

- number
- string
- bool

`;

export { Widget, widgetProps, widgetSummary };
export { markdown };

const context = {
  kind: 'Example Component',
  story: 'example story',
};

export { defaultOptions, defaultMarksyConf, context };

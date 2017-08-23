import Widget from './widget';
import markdown from './summary.md';
import { defaultOptions } from '../../../defaults';

const widgetProps = {
  size: 30,
  backgroundColor: 'coral',
};

const widgetSummary = `
# Widget mock

This is example React component to be used for testing \`addon-info\`

## Contains

- prop types
- default props
- prop decriptions

### prop types

- number
- string
- bool

PR #1501 by @usulpro

### Piece of code now

~~~js
export { Widget, widgetProps, widgetSummary };
export { markdown };

const context = {
  kind: 'Example Component',
  story: 'example story',
  aaa: true,
  bbb: 1 + 1,
  ccc: object.field,
};

function todo(items) {
  return items.map( item => item.make.done );
}

export { defaultOptions, context };
~~~

`;

export { Widget, widgetProps, widgetSummary };
export { markdown };

const context = {
  kind: 'Example Component',
  story: 'example story',
};

export { defaultOptions, context };

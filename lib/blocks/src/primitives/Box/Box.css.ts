import { style } from '@vanilla-extract/css';
import { sprinkles } from '../sprinkles.css';

export const reset = style([
  // This is important to use sprinkles function here
  // by the second style object will be more specific
  sprinkles({
    padding: 'none',
  }),
  {
    margin: 0,
    border: 0,
    boxSizing: 'border-box', // Ensure that padding is included in width
    minWidth: 0, // ensure the Box can shrink below its minimum content size when used as a flex item
    verticalAlign: 'baseline',
    WebkitTapHighlightColor: 'transparent',
  },
]);

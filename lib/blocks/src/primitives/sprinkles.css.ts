import {
  defineProperties,
  createSprinkles,
  createMapValueFn,
  ConditionalValue,
} from '@vanilla-extract/sprinkles';
import { createFillings } from '@angelblock/fillings';
import { style } from '@vanilla-extract/css';
import { vars } from './theme.css';

// Reset styles must be created before sprinkles to have lower specificity
export const reset = style({
  padding: 0,
  margin: 0,
  border: 0,
  boxSizing: 'border-box', // Ensure that padding is included in width
  minWidth: 0, // ensure the Box can shrink below its minimum content size when used as a flex item
  verticalAlign: 'baseline',
  WebkitTapHighlightColor: 'transparent',
});

const responsiveConditions = {
  mobile: { '@media': '' }, // treated as special case - style not wrapped with selector
  tablet: { '@media': 'screen and (min-width: 768px)' },
  desktop: { '@media': 'screen and (min-width: 1024px)' },
} as const;

export const sizeFillings = createFillings({
  conditions: responsiveConditions,
  defaultCondition: 'mobile',
  properties: ['width', 'height', 'gridTemplateColumns', 'gridTemplateRows'],
});

const responsiveSpaceProperties = defineProperties({
  conditions: responsiveConditions,
  defaultCondition: 'mobile',
  responsiveArray: ['mobile', 'tablet', 'desktop'],
  properties: {
    display: ['none', 'flex', 'grid', 'block', 'inline'],
    flexDirection: ['row', 'column'],
    justifyContent: [
      'stretch',
      'flex-start',
      'center',
      'flex-end',
      'space-around',
      'space-between',
    ],
    alignItems: ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'],
    paddingTop: vars.space,
    paddingBottom: vars.space,
    paddingLeft: vars.space,
    paddingRight: vars.space,
    gap: vars.space,

    // Typography
    fontSize: vars.fontSizes,
    fontWeight: vars.fontWeights,
    textAlign: ['left', 'center', 'right'], // Do not include justify for good!

    // Borders
    borderRadius: vars.borderRadius,
    border: {
      none: 'none',
      thin: '1px solid',
    },
    // Shadows
    boxShadow: {
      none: 'none',
      block: `${vars.colors.muted} 0 1px 3px 0`,
    },
  },
  shorthands: {
    padding: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    paddingX: ['paddingLeft', 'paddingRight'],
    paddingY: ['paddingTop', 'paddingBottom'],
    placeItems: ['justifyContent', 'alignItems'],
  },
});

const colorProperties = defineProperties({
  conditions: {
    lightMode: {},
    darkMode: { '@media': '(prefers-color-scheme: dark)' },
  },
  defaultCondition: 'lightMode',
  properties: {
    color: vars.colors,
    background: vars.colors,
    // Borders
    borderTopColor: vars.colors,
    borderRightColor: vars.colors,
    borderBottomColor: vars.colors,
    borderLeftColor: vars.colors,
    // etc.
  },
  shorthands: {
    borderColor: ['borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'],
  },
});

export const sprinkles = createSprinkles(responsiveSpaceProperties, colorProperties);

export const mapResponsiveValue = createMapValueFn(responsiveSpaceProperties);

export type ResponsiveValue<Value extends string | number> = ConditionalValue<
  typeof responsiveSpaceProperties,
  Value
>;

export type Sprinkles = Parameters<typeof sprinkles>[0];

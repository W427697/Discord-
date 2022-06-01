import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles';
import { createFillings } from '@angelblock/fillings';
// import { vars } from './vars.css';

const responsiveConditions = {
  mobile: { '@media': '' }, // treated as special case - style not wrapped with selector
  tablet: { '@media': 'screen and (min-width: 768px)' },
  desktop: { '@media': 'screen and (min-width: 1024px)' },
} as const;

const space = {
  none: 0,
  small: '4px',
  medium: '8px',
  large: '16px',
  // etc.
};

const colors = {
  'blue-50': '#eff6ff',
  'blue-100': '#dbeafe',
  'blue-200': '#bfdbfe',
  'gray-700': '#374151',
  'gray-800': '#1f2937',
  'gray-900': '#111827',
  // etc.
};

export const sizeFillings = createFillings({
  conditions: responsiveConditions,
  defaultCondition: 'mobile',
  properties: ['width', 'height'],
});

const spaceProperties = defineProperties({
  conditions: responsiveConditions,
  defaultCondition: 'mobile',
  properties: {
    display: ['none', 'flex', 'block', 'inline'],
    flexDirection: ['row', 'column'],
    justifyContent: [
      'stretch',
      'flex-start',
      'center',
      'flex-end',
      'space-around',
      'space-between',
    ],
    alignItems: ['stretch', 'flex-start', 'center', 'flex-end'],
    paddingTop: space,
    paddingBottom: space,
    paddingLeft: space,
    paddingRight: space,
    // etc.
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
    color: colors,
    background: colors,
    // etc.
  },
});

export const sprinkles = createSprinkles(spaceProperties, colorProperties);

export type Sprinkles = Parameters<typeof sprinkles>[0];

import type { Args } from '@storybook/types';

/**
 *  omit event args
 * @param args
 */
const omitEvent = (args: Args): Args =>
  args
    ? Object.fromEntries(Object.entries(args).filter(([key, value]) => !key.startsWith('on')))
    : {};

const displayObject = (obj: any): string | boolean | number => {
  if (obj && typeof obj === 'object') {
    return `{${Object.keys(obj)
      .map((key) => `${key}:${displayObject(obj[key])}`)
      .join(',')}}`;
  }
  if (typeof obj === 'string') return `'${obj}'`;
  return obj;
};
const htmlEventAttributeToVueEventAttribute = (key: string) => {
  return /^on[A-Za-z]/.test(key) ? key.replace(/^on/, 'v-on:').toLowerCase() : key;
};

const directiveSource = (key: string, value: unknown) =>
  key.includes('on')
    ? `${htmlEventAttributeToVueEventAttribute(key)}='()=>({})'`
    : `${key}="${value}"`;

const attributeSource = (key: string, value: unknown, dynamic?: boolean) =>
  // convert html event key to vue event key
  ['boolean', 'number', 'object'].includes(typeof value) || // dynamic value
  (dynamic && ['style', 'class'].includes(key)) // dynamic style or class
    ? `:${key}="${displayObject(value)}"`
    : directiveSource(key, value);

const evalExp = (argExpValue: any, args: Args): any => {
  let evalVal = argExpValue;
  if (/v-bind="(\w+)"/.test(evalVal))
    return evalVal.replace(/"(\w+)"/g, `"${displayObject(args)}"`);
  Object.keys(args).forEach((akey) => {
    const regex = new RegExp(`(\\w+)\\.${akey}`, 'g');
    evalVal = evalVal.replace(regex, displayObject(args[akey]));
  });
  return evalVal;
};

export {
  omitEvent,
  displayObject,
  htmlEventAttributeToVueEventAttribute,
  directiveSource,
  attributeSource,
  evalExp,
};

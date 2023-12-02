import * as DATA_TYPES from '../types/dataTypes';

/**
 * Parse.
 * @param string {String} string to parse
 * @returns {*}
 */
export function parse(string: string, dataType: typeof DATA_TYPES[keyof typeof DATA_TYPES]) {
  let result = string;

  // Check if string contains 'function' and start with it to eval it
  if (result.indexOf('function') === 0) {
    return (0, eval)(`(${result})`); // eslint-disable-line no-eval
  }

  if (dataType === DATA_TYPES.BIG_INT) {
    return BigInt(string);
  }

  try {
    result = JSON.parse(string);
  } catch (e) {
    // Error
  }
  return result;
}

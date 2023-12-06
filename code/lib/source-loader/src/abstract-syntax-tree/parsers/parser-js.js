import { parsers } from 'prettier/plugins/babel';

function parse(source) {
  try {
    return parsers.babel.parse(source);
  } catch (error1) {
    try {
      return JSON.stringify(source);
    } catch (error) {
      throw error1;
    }
  }
}
function format(source) {
  return parsers.babel.format(source);
}

export default {
  parse,
  format,
};

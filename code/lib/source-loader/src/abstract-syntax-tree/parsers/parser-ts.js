import { parsers } from 'prettier/plugins/typescript';

function parse(source) {
  try {
    return parsers.typescript.parse(source);
  } catch (error1) {
    try {
      return JSON.stringify(source);
    } catch (error) {
      throw error1;
    }
  }
}
function format(source) {
  return parsers.typescript.format(source);
}

export default {
  parse,
  format,
};

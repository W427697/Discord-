import parseTs from 'prettier/parser-typescript';

function parse(source) {
  try {
    return parseTs.parsers.typescript.parse(source);
  } catch (error1) {
    try {
      return JSON.stringify(source);
    } catch (error) {
      throw error1;
    }
  }
}

export default {
  parse,
};
